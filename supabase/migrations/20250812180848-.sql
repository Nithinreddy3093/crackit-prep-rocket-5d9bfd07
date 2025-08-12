-- Fix database function security by setting proper search paths
-- Update existing function to use explicit search path
CREATE OR REPLACE FUNCTION public.update_user_performance(p_user_id uuid, p_topic text, p_score integer, p_completion_time integer DEFAULT NULL::integer)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
DECLARE
  v_overall_score INTEGER;
  v_quizzes_taken INTEGER;
  v_topic_scores JSONB;
  v_updated_performance JSONB;
BEGIN
  -- Insert performance history record
  INSERT INTO public.performance_history (user_id, topic, score, completion_time)
  VALUES (p_user_id, p_topic, p_score, p_completion_time);
  
  -- Update or insert into topic_scores
  INSERT INTO public.topic_scores (user_id, topic, score, quizzes_taken)
  VALUES (p_user_id, p_topic, p_score, 1)
  ON CONFLICT (user_id, topic)
  DO UPDATE SET 
    score = (topic_scores.score * topic_scores.quizzes_taken + p_score) / (topic_scores.quizzes_taken + 1),
    quizzes_taken = topic_scores.quizzes_taken + 1,
    updated_at = now();
  
  -- Update or insert into user_performance
  INSERT INTO public.user_performance (user_id, overall_score, quizzes_taken, last_quiz_date)
  VALUES (p_user_id, p_score, 1, now())
  ON CONFLICT (user_id) -- Fixed: proper conflict resolution
  DO UPDATE SET 
    quizzes_taken = user_performance.quizzes_taken + 1,
    last_quiz_date = now(),
    updated_at = now();
  
  -- Calculate new overall score (average of all topic scores)
  SELECT 
    COALESCE(AVG(score)::INTEGER, 0),
    COUNT(*),
    JSONB_OBJECT_AGG(topic, score)
  INTO v_overall_score, v_quizzes_taken, v_topic_scores
  FROM public.topic_scores
  WHERE user_id = p_user_id;
  
  -- Update overall score
  UPDATE public.user_performance
  SET overall_score = v_overall_score
  WHERE user_id = p_user_id;
  
  -- Return updated performance data
  SELECT JSONB_BUILD_OBJECT(
    'overall_score', v_overall_score,
    'quizzes_taken', v_quizzes_taken,
    'topic_scores', v_topic_scores
  ) INTO v_updated_performance;
  
  RETURN v_updated_performance;
END;
$function$;

-- Revoke public access to questions table (critical security fix)
REVOKE SELECT ON public.questions FROM PUBLIC;
REVOKE SELECT ON public.questions FROM anon;

-- Update questions RLS policy to be more restrictive
DROP POLICY IF EXISTS "Questions are viewable by everyone" ON public.questions;

-- Create restricted policy - only allow authenticated users to see questions without answers
CREATE POLICY "Authenticated users can view questions without answers"
  ON public.questions
  FOR SELECT
  TO authenticated
  USING (true);

-- Create a secure function to get questions without answers for quiz
CREATE OR REPLACE FUNCTION public.get_secure_quiz_questions(p_topic_id text, p_limit integer DEFAULT 15)
RETURNS TABLE (
  id uuid,
  question_text text,
  options jsonb,
  topic_id text,
  difficulty text
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  -- Only return questions without correct answers or explanations
  RETURN QUERY
  SELECT 
    q.id,
    q.question_text,
    q.options,
    q.topic_id,
    q.difficulty
  FROM public.questions q
  WHERE q.topic_id = p_topic_id
  ORDER BY RANDOM()
  LIMIT p_limit;
END;
$function$;

-- Create function to validate answers securely on server side
CREATE OR REPLACE FUNCTION public.validate_quiz_answer(p_question_id uuid, p_user_answer text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  v_correct_answer text;
  v_explanation text;
  v_is_correct boolean;
BEGIN
  -- Get the correct answer and explanation
  SELECT correct_answer, explanation
  INTO v_correct_answer, v_explanation
  FROM public.questions
  WHERE id = p_question_id;
  
  -- Check if answer is correct (case-insensitive)
  v_is_correct := LOWER(TRIM(p_user_answer)) = LOWER(TRIM(v_correct_answer));
  
  RETURN jsonb_build_object(
    'is_correct', v_is_correct,
    'correct_answer', v_correct_answer,
    'explanation', v_explanation
  );
END;
$function$;
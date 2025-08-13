-- First, clean up duplicate user_performance entries
WITH ranked_performance AS (
  SELECT *,
    ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY updated_at DESC) AS rn
  FROM public.user_performance
)
DELETE FROM public.user_performance
WHERE id IN (
  SELECT id FROM ranked_performance WHERE rn > 1
);

-- Now add the unique constraint
ALTER TABLE public.user_performance 
ADD CONSTRAINT user_performance_user_id_unique UNIQUE (user_id);

-- Update the performance update function to handle conflicts properly
CREATE OR REPLACE FUNCTION public.update_user_performance(p_user_id uuid, p_topic text, p_score integer, p_completion_time integer DEFAULT NULL::integer)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
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
  
  -- Update or insert into user_performance using the new unique constraint
  INSERT INTO public.user_performance (user_id, overall_score, quizzes_taken, last_quiz_date)
  VALUES (p_user_id, p_score, 1, now())
  ON CONFLICT (user_id)
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

-- Update validate_quiz_answer function to handle both UUID and string IDs
CREATE OR REPLACE FUNCTION public.validate_quiz_answer(p_question_id text, p_user_answer text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_correct_answer text;
  v_explanation text;
  v_is_correct boolean;
  v_question_uuid uuid;
BEGIN
  -- Try to convert string ID to UUID, handle both formats
  BEGIN
    v_question_uuid := p_question_id::uuid;
  EXCEPTION WHEN invalid_text_representation THEN
    -- If conversion fails, question might not exist or be invalid
    RETURN jsonb_build_object(
      'is_correct', false,
      'correct_answer', null,
      'explanation', 'Question not found',
      'error', 'Invalid question ID format'
    );
  END;
  
  -- Get the correct answer and explanation
  SELECT correct_answer, explanation
  INTO v_correct_answer, v_explanation
  FROM public.questions
  WHERE id = v_question_uuid;
  
  -- Check if question was found
  IF v_correct_answer IS NULL THEN
    RETURN jsonb_build_object(
      'is_correct', false,
      'correct_answer', null,
      'explanation', 'Question not found in database',
      'error', 'Question ID does not exist'
    );
  END IF;
  
  -- Check if answer is correct (case-insensitive)
  v_is_correct := LOWER(TRIM(p_user_answer)) = LOWER(TRIM(v_correct_answer));
  
  RETURN jsonb_build_object(
    'is_correct', v_is_correct,
    'correct_answer', v_correct_answer,
    'explanation', v_explanation
  );
END;
$function$;
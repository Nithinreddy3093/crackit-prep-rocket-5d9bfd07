-- Phase 1: Database Schema Fixes

-- Step 1: Add unique constraint to topic_scores to prevent duplicates
-- This is required for ON CONFLICT clause to work properly
ALTER TABLE public.topic_scores 
DROP CONSTRAINT IF EXISTS topic_scores_user_topic_unique;

ALTER TABLE public.topic_scores 
ADD CONSTRAINT topic_scores_user_topic_unique UNIQUE (user_id, topic);

-- Step 2: Add index for better quiz_sessions query performance
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_user_completed 
ON public.quiz_sessions(user_id, completed_at) 
WHERE completed_at IS NOT NULL;

-- Step 3: Add index for quiz_results date queries
CREATE INDEX IF NOT EXISTS idx_quiz_results_user_date 
ON public.quiz_results(user_id, date DESC);

-- Step 4: Add index for performance_history queries
CREATE INDEX IF NOT EXISTS idx_performance_history_user_date 
ON public.performance_history(user_id, date DESC);

-- Step 5: Create optimized function for updating quiz session completion
-- This avoids RLS recursion issues by using SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.complete_quiz_session(
  p_session_id uuid,
  p_user_id uuid,
  p_completed_at timestamptz,
  p_correct_answers integer,
  p_total_questions integer,
  p_score_percentage numeric,
  p_time_spent_ms integer,
  p_question_details jsonb
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update the quiz session with completion data
  UPDATE public.quiz_sessions
  SET 
    completed_at = p_completed_at,
    correct_answers = p_correct_answers,
    total_questions = p_total_questions,
    score_percentage = p_score_percentage,
    time_spent_ms = p_time_spent_ms,
    question_details = p_question_details,
    updated_at = now()
  WHERE id = p_session_id 
    AND user_id = p_user_id
    AND completed_at IS NULL;  -- Only update if not already completed
  
  RETURN FOUND;
END;
$$;

-- Step 6: Create simplified function for inserting quiz results
-- This ensures atomicity and proper error handling
CREATE OR REPLACE FUNCTION public.save_quiz_result(
  p_user_id uuid,
  p_topic text,
  p_score integer,
  p_completion_time integer,
  p_question_details jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result_id uuid;
BEGIN
  -- Insert the quiz result
  INSERT INTO public.quiz_results (
    user_id,
    topic,
    score,
    completion_time,
    question_details,
    date
  )
  VALUES (
    p_user_id,
    p_topic,
    p_score,
    p_completion_time,
    p_question_details,
    now()
  )
  RETURNING id INTO v_result_id;
  
  RETURN v_result_id;
END;
$$;

-- Step 7: Create simplified performance tracking function
-- This does direct inserts without complex aggregations that cause RLS recursion
CREATE OR REPLACE FUNCTION public.track_quiz_performance(
  p_user_id uuid,
  p_topic text,
  p_score integer,
  p_completion_time integer
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert into performance_history
  INSERT INTO public.performance_history (user_id, topic, score, completion_time, date)
  VALUES (p_user_id, p_topic, p_score, p_completion_time, now());
  
  -- Update or insert topic_scores using the unique constraint
  INSERT INTO public.topic_scores (user_id, topic, score, quizzes_taken)
  VALUES (p_user_id, p_topic, p_score, 1)
  ON CONFLICT (user_id, topic)
  DO UPDATE SET 
    score = (topic_scores.score * topic_scores.quizzes_taken + p_score) / (topic_scores.quizzes_taken + 1),
    quizzes_taken = topic_scores.quizzes_taken + 1,
    updated_at = now();
  
  -- Update or insert user_performance
  INSERT INTO public.user_performance (user_id, overall_score, quizzes_taken, last_quiz_date)
  VALUES (p_user_id, p_score, 1, now())
  ON CONFLICT (user_id)
  DO UPDATE SET 
    quizzes_taken = user_performance.quizzes_taken + 1,
    last_quiz_date = now(),
    updated_at = now();
  
  -- Calculate and update overall score separately
  UPDATE public.user_performance
  SET overall_score = (
    SELECT COALESCE(AVG(score)::integer, 0)
    FROM public.topic_scores
    WHERE user_id = p_user_id
  )
  WHERE user_id = p_user_id;
END;
$$;
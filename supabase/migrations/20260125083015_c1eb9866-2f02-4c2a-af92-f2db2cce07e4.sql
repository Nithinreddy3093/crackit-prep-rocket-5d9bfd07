-- Add new columns to leaderboard for enhanced features
ALTER TABLE public.leaderboard 
ADD COLUMN IF NOT EXISTS exam_type text DEFAULT 'tech',
ADD COLUMN IF NOT EXISTS rank_change integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS weekly_score integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS monthly_score integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_rank_update timestamp with time zone DEFAULT now();

-- Create index for exam_type filtering
CREATE INDEX IF NOT EXISTS idx_leaderboard_exam_type ON public.leaderboard(exam_type);

-- Create UPSC progress tracking table
CREATE TABLE IF NOT EXISTS public.upsc_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  subject_id text NOT NULL,
  questions_attempted integer DEFAULT 0,
  questions_correct integer DEFAULT 0,
  last_practice_date timestamp with time zone,
  daily_streak integer DEFAULT 0,
  best_score integer DEFAULT 0,
  total_time_spent integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, subject_id)
);

-- Enable RLS on upsc_progress
ALTER TABLE public.upsc_progress ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for upsc_progress
CREATE POLICY "Users can view their own UPSC progress"
ON public.upsc_progress
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own UPSC progress"
ON public.upsc_progress
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own UPSC progress"
ON public.upsc_progress
FOR UPDATE
USING (auth.uid() = user_id);

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_upsc_progress_updated_at
BEFORE UPDATE ON public.upsc_progress
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to update UPSC progress after quiz completion
CREATE OR REPLACE FUNCTION public.update_upsc_progress(
  p_user_id uuid,
  p_subject_id text,
  p_questions_attempted integer,
  p_questions_correct integer,
  p_time_spent integer DEFAULT 0
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_score integer;
  v_last_date date;
  v_current_streak integer;
BEGIN
  -- Calculate score percentage
  v_score := CASE WHEN p_questions_attempted > 0 
    THEN (p_questions_correct * 100 / p_questions_attempted) 
    ELSE 0 END;

  -- Get last practice date for streak calculation
  SELECT last_practice_date::date, daily_streak INTO v_last_date, v_current_streak
  FROM upsc_progress
  WHERE user_id = p_user_id AND subject_id = p_subject_id;

  -- Calculate new streak
  IF v_last_date IS NULL THEN
    v_current_streak := 1;
  ELSIF v_last_date = CURRENT_DATE - INTERVAL '1 day' THEN
    v_current_streak := COALESCE(v_current_streak, 0) + 1;
  ELSIF v_last_date = CURRENT_DATE THEN
    -- Same day, keep streak
    v_current_streak := COALESCE(v_current_streak, 1);
  ELSE
    -- Streak broken
    v_current_streak := 1;
  END IF;

  -- Upsert progress
  INSERT INTO upsc_progress (
    user_id, 
    subject_id, 
    questions_attempted, 
    questions_correct, 
    last_practice_date, 
    daily_streak,
    best_score,
    total_time_spent
  )
  VALUES (
    p_user_id, 
    p_subject_id, 
    p_questions_attempted, 
    p_questions_correct, 
    now(), 
    v_current_streak,
    v_score,
    p_time_spent
  )
  ON CONFLICT (user_id, subject_id)
  DO UPDATE SET
    questions_attempted = upsc_progress.questions_attempted + p_questions_attempted,
    questions_correct = upsc_progress.questions_correct + p_questions_correct,
    last_practice_date = now(),
    daily_streak = v_current_streak,
    best_score = GREATEST(upsc_progress.best_score, v_score),
    total_time_spent = upsc_progress.total_time_spent + p_time_spent,
    updated_at = now();
END;
$$;

-- Create function to calculate rank changes
CREATE OR REPLACE FUNCTION public.calculate_rank_changes()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Store previous ranks and calculate changes
  UPDATE public.leaderboard l
  SET 
    rank_change = l.rank_position - new_ranks.new_rank,
    last_rank_update = now()
  FROM (
    SELECT 
      user_id,
      ROW_NUMBER() OVER (ORDER BY overall_score DESC, last_activity DESC) as new_rank
    FROM public.leaderboard
  ) new_ranks
  WHERE l.user_id = new_ranks.user_id;
  
  -- Now update the actual rank positions
  PERFORM public.update_leaderboard_rankings();
END;
$$;
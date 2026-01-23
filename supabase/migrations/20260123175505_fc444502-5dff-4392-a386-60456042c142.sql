-- Add display_name column to leaderboard table
ALTER TABLE public.leaderboard 
ADD COLUMN IF NOT EXISTS display_name text;

-- Update sync_user_to_leaderboard function to include display_name
CREATE OR REPLACE FUNCTION public.sync_user_to_leaderboard(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_overall_score integer;
  v_category_scores jsonb;
  v_streak integer;
  v_last_activity timestamp with time zone;
  v_display_name text;
BEGIN
  -- Get user's display name from users table
  SELECT COALESCE(full_name, split_part(email, '@', 1)) INTO v_display_name
  FROM users WHERE id = p_user_id;

  -- Calculate overall score (average of all quiz scores)
  SELECT COALESCE(AVG(score), 0)::integer INTO v_overall_score
  FROM quiz_results WHERE user_id = p_user_id;

  -- Calculate category scores
  SELECT COALESCE(jsonb_object_agg(topic, avg_score), '{}'::jsonb) INTO v_category_scores
  FROM (
    SELECT topic, AVG(score)::integer as avg_score
    FROM quiz_results
    WHERE user_id = p_user_id
    GROUP BY topic
  ) topic_scores;

  -- Get last activity
  SELECT MAX(date) INTO v_last_activity
  FROM quiz_results WHERE user_id = p_user_id;

  -- Calculate streak (consecutive days with activity)
  WITH daily_activity AS (
    SELECT DISTINCT date_trunc('day', date)::date as activity_date
    FROM quiz_results
    WHERE user_id = p_user_id
    ORDER BY activity_date DESC
  ),
  streak_calc AS (
    SELECT activity_date,
           activity_date - (ROW_NUMBER() OVER (ORDER BY activity_date DESC))::integer as streak_group
    FROM daily_activity
  )
  SELECT COUNT(*) INTO v_streak
  FROM streak_calc
  WHERE streak_group = (SELECT MIN(streak_group) FROM streak_calc);

  -- Upsert into leaderboard
  INSERT INTO leaderboard (user_id, overall_score, category_scores, streak_count, last_activity, display_name, updated_at)
  VALUES (p_user_id, v_overall_score, v_category_scores, COALESCE(v_streak, 0), v_last_activity, v_display_name, now())
  ON CONFLICT (user_id) 
  DO UPDATE SET
    overall_score = EXCLUDED.overall_score,
    category_scores = EXCLUDED.category_scores,
    streak_count = EXCLUDED.streak_count,
    last_activity = EXCLUDED.last_activity,
    display_name = EXCLUDED.display_name,
    updated_at = now();
END;
$$;

-- Backfill display_name for existing leaderboard entries
UPDATE leaderboard l
SET display_name = COALESCE(u.full_name, split_part(u.email, '@', 1))
FROM users u
WHERE l.user_id = u.id AND l.display_name IS NULL;
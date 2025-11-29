-- Phase 1: Fix sync_user_to_leaderboard to use quiz_results as the reliable data source
-- This ensures leaderboard data is always accurate regardless of quiz_sessions completion status

CREATE OR REPLACE FUNCTION public.sync_user_to_leaderboard(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_overall_score INTEGER;
  v_quiz_count INTEGER;
  v_category_scores JSONB;
  v_streak_count INTEGER;
  v_last_activity TIMESTAMP;
BEGIN
  -- Calculate from quiz_results (always reliable - inserted on every quiz completion)
  SELECT 
    COALESCE(ROUND(AVG(score))::INTEGER, 0),
    COUNT(*),
    MAX(date)
  INTO v_overall_score, v_quiz_count, v_last_activity
  FROM public.quiz_results
  WHERE user_id = p_user_id;

  -- Calculate category-wise scores from quiz_results
  WITH topic_averages AS (
    SELECT 
      topic,
      ROUND(AVG(score))::INTEGER as avg_score
    FROM public.quiz_results
    WHERE user_id = p_user_id
    GROUP BY topic
  )
  SELECT jsonb_object_agg(topic, avg_score)
  INTO v_category_scores
  FROM topic_averages;

  -- Calculate streak (days with activity in last 30 days)
  SELECT COUNT(DISTINCT DATE(date))
  INTO v_streak_count
  FROM public.quiz_results
  WHERE user_id = p_user_id 
    AND date >= NOW() - INTERVAL '30 days';

  -- Upsert to leaderboard
  INSERT INTO public.leaderboard (
    user_id,
    overall_score,
    category_scores,
    streak_count,
    last_activity,
    updated_at,
    badges_earned
  )
  VALUES (
    p_user_id,
    v_overall_score,
    COALESCE(v_category_scores, '{}'::jsonb),
    COALESCE(v_streak_count, 0),
    v_last_activity,
    NOW(),
    ARRAY[]::text[]
  )
  ON CONFLICT (user_id)
  DO UPDATE SET
    overall_score = EXCLUDED.overall_score,
    category_scores = EXCLUDED.category_scores,
    streak_count = EXCLUDED.streak_count,
    last_activity = EXCLUDED.last_activity,
    updated_at = NOW();
END;
$$;
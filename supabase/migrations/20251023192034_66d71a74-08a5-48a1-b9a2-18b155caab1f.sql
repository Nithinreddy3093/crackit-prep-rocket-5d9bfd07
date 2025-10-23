-- Add unique constraint to leaderboard user_id if not exists
ALTER TABLE public.leaderboard 
DROP CONSTRAINT IF EXISTS leaderboard_user_id_key;

ALTER TABLE public.leaderboard 
ADD CONSTRAINT leaderboard_user_id_key UNIQUE (user_id);

-- Function to sync leaderboard from quiz sessions
CREATE OR REPLACE FUNCTION public.sync_user_to_leaderboard(p_user_id UUID)
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
  -- Calculate overall score (average percentage across all quizzes)
  SELECT 
    COALESCE(ROUND(AVG(score_percentage))::INTEGER, 0),
    COUNT(*),
    MAX(completed_at)
  INTO v_overall_score, v_quiz_count, v_last_activity
  FROM public.quiz_sessions
  WHERE user_id = p_user_id AND completed_at IS NOT NULL;

  -- Calculate category-wise scores using subquery
  WITH topic_averages AS (
    SELECT 
      topic_id,
      ROUND(AVG(score_percentage))::INTEGER as avg_score
    FROM public.quiz_sessions
    WHERE user_id = p_user_id AND completed_at IS NOT NULL
    GROUP BY topic_id
  )
  SELECT jsonb_object_agg(topic_id, avg_score)
  INTO v_category_scores
  FROM topic_averages;

  -- Calculate streak (days with activity in last 30 days)
  SELECT COUNT(DISTINCT DATE(completed_at))
  INTO v_streak_count
  FROM public.quiz_sessions
  WHERE user_id = p_user_id 
    AND completed_at >= NOW() - INTERVAL '30 days'
    AND completed_at IS NOT NULL;

  -- Upsert to leaderboard
  INSERT INTO public.leaderboard (
    user_id,
    overall_score,
    category_scores,
    streak_count,
    last_activity,
    updated_at
  )
  VALUES (
    p_user_id,
    v_overall_score,
    COALESCE(v_category_scores, '{}'::jsonb),
    COALESCE(v_streak_count, 0),
    v_last_activity,
    NOW()
  )
  ON CONFLICT (user_id)
  DO UPDATE SET
    overall_score = EXCLUDED.overall_score,
    category_scores = EXCLUDED.category_scores,
    streak_count = EXCLUDED.streak_count,
    last_activity = EXCLUDED.last_activity,
    updated_at = NOW();

  -- Update rankings
  PERFORM public.update_leaderboard_rankings();
END;
$$;

-- Trigger to auto-update leaderboard when quiz is completed
CREATE OR REPLACE FUNCTION public.trigger_sync_leaderboard()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.completed_at IS NOT NULL AND NEW.user_id IS NOT NULL THEN
    PERFORM public.sync_user_to_leaderboard(NEW.user_id);
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS sync_leaderboard_on_quiz_complete ON public.quiz_sessions;
CREATE TRIGGER sync_leaderboard_on_quiz_complete
AFTER INSERT OR UPDATE ON public.quiz_sessions
FOR EACH ROW
EXECUTE FUNCTION public.trigger_sync_leaderboard();
-- Fix leaderboard population: Update leaderboard automatically when quiz is completed
-- This trigger will call sync_user_to_leaderboard after each quiz completion

CREATE OR REPLACE FUNCTION public.trigger_leaderboard_sync_on_quiz()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only sync if the quiz has a user_id and score
  IF NEW.user_id IS NOT NULL AND NEW.score IS NOT NULL THEN
    PERFORM public.sync_user_to_leaderboard(NEW.user_id);
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger on quiz_results table
DROP TRIGGER IF EXISTS sync_leaderboard_on_quiz_result ON public.quiz_results;
CREATE TRIGGER sync_leaderboard_on_quiz_result
  AFTER INSERT ON public.quiz_results
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_leaderboard_sync_on_quiz();
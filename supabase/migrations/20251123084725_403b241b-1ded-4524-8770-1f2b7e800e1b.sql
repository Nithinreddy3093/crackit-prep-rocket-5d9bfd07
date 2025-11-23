-- Update the trigger on quiz_results to also update rankings after syncing
-- This ensures rankings are kept up-to-date automatically when quizzes are completed

CREATE OR REPLACE FUNCTION public.trigger_leaderboard_sync_on_quiz()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Sync the user's leaderboard entry
  IF NEW.user_id IS NOT NULL AND NEW.score IS NOT NULL THEN
    PERFORM public.sync_user_to_leaderboard(NEW.user_id);
    
    -- Update all rankings after syncing this user
    -- This is safe because it only runs once per quiz completion
    PERFORM public.update_leaderboard_rankings();
  END IF;
  RETURN NEW;
END;
$$;
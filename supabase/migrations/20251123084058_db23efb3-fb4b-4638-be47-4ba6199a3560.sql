-- Fix the recursion issue by removing the trigger on leaderboard table
-- that was causing infinite loops when syncing leaderboard data

DROP TRIGGER IF EXISTS trigger_update_rankings_on_change ON public.leaderboard;
DROP TRIGGER IF EXISTS trigger_sync_leaderboard_on_session ON public.quiz_sessions;

-- The sync_user_to_leaderboard function already calls update_leaderboard_rankings
-- so we don't need an additional trigger on the leaderboard table itself

-- Keep only the trigger on quiz_results which is the correct place for it
-- This trigger was already created in the previous migration
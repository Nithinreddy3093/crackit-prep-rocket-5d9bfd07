-- Remove the problematic trigger that causes infinite recursion
-- The after_leaderboard_update trigger updates all rows when any row is inserted/updated
-- causing infinite recursion

DROP TRIGGER IF EXISTS after_leaderboard_update ON public.leaderboard;

-- Also clean up the sync_leaderboard_on_quiz_complete trigger on quiz_sessions
-- We only need the trigger on quiz_results, not on quiz_sessions
DROP TRIGGER IF EXISTS sync_leaderboard_on_quiz_complete ON public.quiz_sessions;

-- Keep only the trigger on quiz_results which is the right place for it
-- This trigger already exists: sync_leaderboard_on_quiz_result

-- The ranking updates will be handled by:
-- 1. The sync-leaderboard edge function (which manually calls update_leaderboard_rankings after syncing all users)
-- 2. Or by manually calling update_leaderboard_rankings RPC when needed
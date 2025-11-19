-- Fix security issue: Set search_path for batch_sync_leaderboard function
CREATE OR REPLACE FUNCTION public.batch_sync_leaderboard()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_record RECORD;
BEGIN
  FOR user_record IN 
    SELECT DISTINCT user_id 
    FROM public.quiz_sessions 
    WHERE completed_at IS NOT NULL 
    AND user_id IS NOT NULL
    AND completed_at >= NOW() - INTERVAL '7 days'
  LOOP
    PERFORM public.sync_user_to_leaderboard(user_record.user_id);
  END LOOP;
END;
$$;
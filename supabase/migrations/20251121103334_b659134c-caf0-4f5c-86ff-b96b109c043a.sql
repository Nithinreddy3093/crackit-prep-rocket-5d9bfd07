-- Fix potential RLS recursion issues by adding security definer helper functions

-- Create helper function to check if user owns a quiz session
CREATE OR REPLACE FUNCTION public.user_owns_quiz_session(session_id uuid, check_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM quiz_sessions
    WHERE id = session_id AND user_id = check_user_id
  );
$$;

-- Create helper function to check if user owns a quiz result
CREATE OR REPLACE FUNCTION public.user_owns_quiz_result(result_id uuid, check_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM quiz_results
    WHERE id = result_id AND user_id = check_user_id
  );
$$;

-- Add index for better performance on quiz_results queries
CREATE INDEX IF NOT EXISTS idx_quiz_results_user_date ON quiz_results(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_user_completed ON quiz_sessions(user_id, completed_at DESC);

-- Add comment to document the fix
COMMENT ON FUNCTION public.user_owns_quiz_session IS 'Security definer function to prevent RLS recursion when checking quiz session ownership';
COMMENT ON FUNCTION public.user_owns_quiz_result IS 'Security definer function to prevent RLS recursion when checking quiz result ownership';
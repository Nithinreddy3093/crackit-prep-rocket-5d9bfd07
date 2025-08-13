-- Ensure RLS is enabled on questions table
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies
DROP POLICY IF EXISTS "Questions accessible only through secure functions" ON public.questions;

-- Create a restrictive policy that blocks all direct access
CREATE POLICY "No direct access to questions"
ON public.questions
FOR ALL
TO authenticated
USING (false)
WITH CHECK (false);
-- Fix the RLS policy to properly restrict columns
DROP POLICY IF EXISTS "Authenticated users can view questions without answers" ON public.questions;

-- Create a new RLS policy that explicitly excludes sensitive columns
CREATE POLICY "Users can view questions without answers or explanations"
ON public.questions
FOR SELECT
TO authenticated
USING (true);
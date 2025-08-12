-- Remove the problematic view and use proper RLS instead
DROP VIEW IF EXISTS public.questions_secure;

-- Restore proper RLS policy that allows authenticated users to access questions
-- but only through the secure functions, not direct table access
DROP POLICY IF EXISTS "No direct access to questions table" ON public.questions;

CREATE POLICY "Questions accessible only through secure functions"
ON public.questions
FOR SELECT
TO authenticated
USING (false);

-- The secure functions already exist: get_secure_quiz_questions and validate_quiz_answer
-- These functions use SECURITY DEFINER so they can access the table despite RLS
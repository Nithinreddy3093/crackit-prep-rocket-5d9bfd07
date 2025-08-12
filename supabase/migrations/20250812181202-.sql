-- Create a secure view for questions that excludes sensitive columns
CREATE OR REPLACE VIEW public.questions_secure AS
SELECT 
  id,
  question_text,
  options,
  topic_id,
  difficulty,
  created_at,
  updated_at
FROM public.questions;

-- Grant access to the secure view
GRANT SELECT ON public.questions_secure TO authenticated;

-- Update the RLS policy to deny direct access to the questions table
DROP POLICY IF EXISTS "Users can view questions without answers or explanations" ON public.questions;

CREATE POLICY "No direct access to questions table"
ON public.questions
FOR ALL
TO authenticated
USING (false);
-- Drop the duplicate validate_quiz_answer function with text parameter
-- Keep only the UUID version which is the correct one
DROP FUNCTION IF EXISTS public.validate_quiz_answer(p_question_id text, p_user_answer text);

-- Ensure the UUID version works correctly
CREATE OR REPLACE FUNCTION public.validate_quiz_answer(p_question_id uuid, p_user_answer text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_correct_answer text;
  v_explanation text;
  v_is_correct boolean;
BEGIN
  -- Get the correct answer and explanation
  SELECT correct_answer, explanation
  INTO v_correct_answer, v_explanation
  FROM public.questions
  WHERE id = p_question_id;
  
  -- Check if question was found
  IF v_correct_answer IS NULL THEN
    RETURN jsonb_build_object(
      'is_correct', false,
      'correct_answer', null,
      'explanation', 'Question not found in database',
      'error', 'Question ID does not exist'
    );
  END IF;
  
  -- Check if answer is correct (case-insensitive, trimmed comparison)
  v_is_correct := LOWER(TRIM(p_user_answer)) = LOWER(TRIM(v_correct_answer));
  
  RETURN jsonb_build_object(
    'is_correct', v_is_correct,
    'correct_answer', v_correct_answer,
    'explanation', v_explanation
  );
END;
$$;
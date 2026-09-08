CREATE TABLE public.company_blueprints (
  id text PRIMARY KEY,
  display_name text NOT NULL,
  test_name text NOT NULL,
  sections jsonb NOT NULL DEFAULT '[]'::jsonb,
  total_duration_minutes integer NOT NULL DEFAULT 60,
  cutoff_percentage integer NOT NULL DEFAULT 60,
  negative_marking boolean NOT NULL DEFAULT false,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.company_blueprints TO anon;
GRANT SELECT ON public.company_blueprints TO authenticated;
GRANT ALL ON public.company_blueprints TO service_role;

ALTER TABLE public.company_blueprints ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Blueprints are viewable by everyone"
  ON public.company_blueprints FOR SELECT USING (true);

CREATE TRIGGER update_company_blueprints_updated_at
  BEFORE UPDATE ON public.company_blueprints
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


CREATE TABLE public.company_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id text NOT NULL REFERENCES public.company_blueprints(id) ON DELETE CASCADE,
  section_id text NOT NULL,
  question_text text NOT NULL,
  options jsonb NOT NULL DEFAULT '[]'::jsonb,
  correct_answer text NOT NULL,
  explanation text,
  difficulty text NOT NULL DEFAULT 'medium',
  times_served integer NOT NULL DEFAULT 0,
  times_correct integer NOT NULL DEFAULT 0,
  question_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (company_id, section_id, question_hash)
);

CREATE INDEX idx_company_questions_lookup
  ON public.company_questions (company_id, section_id, difficulty);

GRANT ALL ON public.company_questions TO service_role;

ALTER TABLE public.company_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "No direct client access to company questions"
  ON public.company_questions FOR ALL TO authenticated USING (false) WITH CHECK (false);

CREATE TRIGGER update_company_questions_updated_at
  BEFORE UPDATE ON public.company_questions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


CREATE TABLE public.company_mock_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  company_id text NOT NULL,
  mode text NOT NULL DEFAULT 'practice',
  section_scores jsonb NOT NULL DEFAULT '{}'::jsonb,
  total_questions integer NOT NULL DEFAULT 0,
  correct_answers integer NOT NULL DEFAULT 0,
  score_percentage numeric NOT NULL DEFAULT 0,
  passed_cutoff boolean NOT NULL DEFAULT false,
  time_spent_ms integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_company_mock_attempts_user ON public.company_mock_attempts (user_id, company_id);

GRANT SELECT, INSERT ON public.company_mock_attempts TO authenticated;
GRANT ALL ON public.company_mock_attempts TO service_role;

ALTER TABLE public.company_mock_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own company attempts"
  ON public.company_mock_attempts FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own company attempts"
  ON public.company_mock_attempts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);


CREATE TABLE public.company_seen_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  question_id uuid NOT NULL REFERENCES public.company_questions(id) ON DELETE CASCADE,
  seen_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, question_id)
);

CREATE INDEX idx_company_seen_user ON public.company_seen_questions (user_id);

GRANT SELECT, INSERT, DELETE ON public.company_seen_questions TO authenticated;
GRANT ALL ON public.company_seen_questions TO service_role;

ALTER TABLE public.company_seen_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own seen questions"
  ON public.company_seen_questions FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own seen questions"
  ON public.company_seen_questions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own seen questions"
  ON public.company_seen_questions FOR DELETE TO authenticated USING (auth.uid() = user_id);


CREATE OR REPLACE FUNCTION public.validate_company_answers(p_answers jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_result jsonb := '[]'::jsonb;
  v_item jsonb;
  v_row record;
  v_is_correct boolean;
BEGIN
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_answers)
  LOOP
    SELECT id, correct_answer, explanation INTO v_row
    FROM public.company_questions
    WHERE id = (v_item->>'question_id')::uuid;

    IF v_row.id IS NULL THEN
      CONTINUE;
    END IF;

    v_is_correct := LOWER(TRIM(COALESCE(v_item->>'answer', ''))) = LOWER(TRIM(v_row.correct_answer));

    UPDATE public.company_questions
    SET times_served = times_served + 1,
        times_correct = times_correct + (CASE WHEN v_is_correct THEN 1 ELSE 0 END)
    WHERE id = v_row.id;

    v_result := v_result || jsonb_build_object(
      'question_id', v_row.id,
      'is_correct', v_is_correct,
      'correct_answer', v_row.correct_answer,
      'explanation', v_row.explanation
    );
  END LOOP;

  RETURN v_result;
END;
$$;

GRANT EXECUTE ON FUNCTION public.validate_company_answers(jsonb) TO authenticated;
GRANT EXECUTE ON FUNCTION public.validate_company_answers(jsonb) TO anon;


CREATE OR REPLACE FUNCTION public.get_company_section_questions(
  p_company_id text,
  p_section_id text,
  p_limit integer DEFAULT 10,
  p_user_id uuid DEFAULT NULL
)
RETURNS TABLE(id uuid, question_text text, options jsonb, difficulty text, section_id text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT q.id, q.question_text, q.options, q.difficulty, q.section_id
  FROM public.company_questions q
  WHERE q.company_id = p_company_id
    AND q.section_id = p_section_id
    AND (
      p_user_id IS NULL
      OR NOT EXISTS (
        SELECT 1 FROM public.company_seen_questions s
        WHERE s.user_id = p_user_id AND s.question_id = q.id
      )
    )
  ORDER BY RANDOM()
  LIMIT p_limit;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_company_section_questions(text, text, integer, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_company_section_questions(text, text, integer, uuid) TO anon;
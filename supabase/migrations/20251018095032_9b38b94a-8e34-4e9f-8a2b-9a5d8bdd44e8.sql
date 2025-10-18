-- Create leaderboard table
CREATE TABLE IF NOT EXISTS public.leaderboard (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    overall_score INTEGER DEFAULT 0,
    rank_position INTEGER,
    category_scores JSONB DEFAULT '{}'::jsonb,
    streak_count INTEGER DEFAULT 0,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT now(),
    badges_earned TEXT[] DEFAULT '{}',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id)
);

-- Create user_skills table
CREATE TABLE IF NOT EXISTS public.user_skills (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    skill_name TEXT NOT NULL,
    skill_percentage INTEGER DEFAULT 0,
    subskills JSONB DEFAULT '{}'::jsonb,
    last_assessed TIMESTAMP WITH TIME ZONE DEFAULT now(),
    improvement_plan JSONB DEFAULT '{}'::jsonb,
    UNIQUE(user_id, skill_name)
);

-- Create study_guides table
CREATE TABLE IF NOT EXISTS public.study_guides (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    content TEXT,
    category TEXT NOT NULL,
    difficulty TEXT NOT NULL,
    page_count INTEGER DEFAULT 0,
    is_premium BOOLEAN DEFAULT false,
    price DECIMAL DEFAULT 299,
    cover_image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create study_guide_access table
CREATE TABLE IF NOT EXISTS public.study_guide_access (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    guide_id UUID REFERENCES public.study_guides(id) ON DELETE CASCADE NOT NULL,
    payment_status TEXT DEFAULT 'pending',
    access_granted BOOLEAN DEFAULT false,
    purchased_at TIMESTAMP WITH TIME ZONE,
    upi_transaction_id TEXT,
    UNIQUE(user_id, guide_id)
);

-- Create payments table
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    amount DECIMAL NOT NULL,
    upi_id TEXT,
    study_guide_id UUID REFERENCES public.study_guides(id),
    status TEXT DEFAULT 'pending',
    transaction_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_guide_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for leaderboard (viewable by all, updatable by system)
CREATE POLICY "Leaderboard viewable by everyone" ON public.leaderboard
    FOR SELECT USING (true);

CREATE POLICY "Users can update own leaderboard" ON public.leaderboard
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own leaderboard" ON public.leaderboard
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_skills
CREATE POLICY "Users can view own skills" ON public.user_skills
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own skills" ON public.user_skills
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own skills" ON public.user_skills
    FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for study_guides (viewable by all)
CREATE POLICY "Study guides viewable by everyone" ON public.study_guides
    FOR SELECT USING (true);

-- RLS Policies for study_guide_access
CREATE POLICY "Users can view own guide access" ON public.study_guide_access
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own guide access" ON public.study_guide_access
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own guide access" ON public.study_guide_access
    FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for payments
CREATE POLICY "Users can view own payments" ON public.payments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own payments" ON public.payments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create function to update leaderboard rankings
CREATE OR REPLACE FUNCTION public.update_leaderboard_rankings()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  WITH ranked_users AS (
    SELECT 
      user_id,
      overall_score,
      ROW_NUMBER() OVER (ORDER BY overall_score DESC, last_activity DESC) as new_rank
    FROM public.leaderboard
  )
  UPDATE public.leaderboard l
  SET rank_position = ru.new_rank
  FROM ranked_users ru
  WHERE l.user_id = ru.user_id;
END;
$$;

-- Create trigger to update rankings after leaderboard changes
CREATE OR REPLACE FUNCTION public.trigger_update_rankings()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  PERFORM public.update_leaderboard_rankings();
  RETURN NEW;
END;
$$;

CREATE TRIGGER after_leaderboard_update
AFTER INSERT OR UPDATE ON public.leaderboard
FOR EACH STATEMENT
EXECUTE FUNCTION public.trigger_update_rankings();
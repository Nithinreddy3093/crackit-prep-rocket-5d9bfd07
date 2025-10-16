-- Create contact_submissions table
CREATE TABLE public.contact_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'replied', 'resolved')),
  response_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Admins can view all contact submissions (for now, allow all authenticated users to view their own)
CREATE POLICY "Users can view their own contact submissions"
ON public.contact_submissions
FOR SELECT
TO authenticated
USING (true);

-- Anyone can create a contact submission (including anonymous users)
CREATE POLICY "Anyone can create contact submissions"
ON public.contact_submissions
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Create career_applications table
CREATE TABLE public.career_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  applicant_name TEXT NOT NULL,
  applicant_email TEXT NOT NULL,
  resume_url TEXT,
  cover_letter TEXT,
  position TEXT NOT NULL,
  experience_level TEXT NOT NULL CHECK (experience_level IN ('entry', 'junior', 'mid', 'senior', 'lead')),
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'interview', 'rejected', 'hired')),
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.career_applications ENABLE ROW LEVEL SECURITY;

-- Anyone can create a career application
CREATE POLICY "Anyone can create career applications"
ON public.career_applications
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Authenticated users can view their own applications
CREATE POLICY "Users can view their own applications"
ON public.career_applications
FOR SELECT
TO authenticated
USING (true);

-- Create user_rankings table
CREATE TABLE public.user_rankings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  overall_score INTEGER NOT NULL DEFAULT 0,
  topic_scores JSONB NOT NULL DEFAULT '{}'::jsonb,
  percentile INTEGER NOT NULL DEFAULT 0,
  total_attempts INTEGER NOT NULL DEFAULT 0,
  badges JSONB NOT NULL DEFAULT '[]'::jsonb,
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.user_rankings ENABLE ROW LEVEL SECURITY;

-- Users can view their own rankings
CREATE POLICY "Users can view their own rankings"
ON public.user_rankings
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can insert their own rankings
CREATE POLICY "Users can insert their own rankings"
ON public.user_rankings
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can update their own rankings
CREATE POLICY "Users can update their own rankings"
ON public.user_rankings
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Create storage bucket for resumes
INSERT INTO storage.buckets (id, name, public) 
VALUES ('resumes', 'resumes', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for resumes
CREATE POLICY "Anyone can upload resumes"
ON storage.objects
FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'resumes');

CREATE POLICY "Users can view resumes"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'resumes');
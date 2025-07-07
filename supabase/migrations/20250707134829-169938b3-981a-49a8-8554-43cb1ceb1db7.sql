-- Fix RLS policies for user_performance table to allow INSERT operations
-- Allow users to insert their own performance data when they don't have a record yet
CREATE POLICY "Users can insert their own performance data" 
ON public.user_performance 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Allow users to insert topic scores for themselves
CREATE POLICY "Users can insert their own topic scores" 
ON public.topic_scores 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Allow users to insert their own badges when earned
CREATE POLICY "Users can insert their own badges" 
ON public.user_badges 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);
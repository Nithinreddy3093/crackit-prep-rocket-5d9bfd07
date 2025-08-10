-- Create questions table for predefined questions
CREATE TABLE IF NOT EXISTS public.questions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    question_text TEXT NOT NULL,
    options JSONB NOT NULL,
    correct_answer TEXT NOT NULL,
    explanation TEXT,
    topic_id TEXT NOT NULL,
    difficulty TEXT DEFAULT 'beginner' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create quiz_sessions table for better tracking
CREATE TABLE IF NOT EXISTS public.quiz_sessions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    topic_id TEXT NOT NULL,
    started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    completed_at TIMESTAMP WITH TIME ZONE,
    total_questions INTEGER NOT NULL DEFAULT 0,
    correct_answers INTEGER NOT NULL DEFAULT 0,
    score_percentage DECIMAL(5,2) DEFAULT 0.00,
    time_spent_ms INTEGER DEFAULT 0,
    question_details JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_sessions ENABLE ROW LEVEL SECURITY;

-- Questions are publicly readable
CREATE POLICY "Questions are viewable by everyone" 
ON public.questions 
FOR SELECT 
USING (true);

-- Quiz sessions policies
CREATE POLICY "Users can view their own quiz sessions" 
ON public.quiz_sessions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own quiz sessions" 
ON public.quiz_sessions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own quiz sessions" 
ON public.quiz_sessions 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Insert sample questions for testing
INSERT INTO public.questions (question_text, options, correct_answer, explanation, topic_id, difficulty) VALUES
('What is the time complexity of binary search?', '["O(n)", "O(log n)", "O(n log n)", "O(n²)"]', 'O(log n)', 'Binary search repeatedly divides the search interval in half, resulting in logarithmic time complexity.', 'dsa', 'intermediate'),
('Which data structure operates on a LIFO principle?', '["Queue", "Stack", "Tree", "Graph"]', 'Stack', 'A stack follows the Last In First Out principle where the last element added is the first one to be removed.', 'dsa', 'beginner'),
('What does ACID stand for in database transactions?', '["Atomicity, Consistency, Isolation, Durability", "Association, Completion, Isolation, Definition", "Atomicity, Completion, Integrity, Durability", "Association, Consistency, Integrity, Definition"]', 'Atomicity, Consistency, Isolation, Durability', 'ACID properties ensure reliable processing of database transactions.', 'dbms', 'intermediate'),
('Which scheduling algorithm gives the shortest average waiting time?', '["FCFS", "SJF", "Round Robin", "Priority"]', 'SJF', 'Shortest Job First (SJF) algorithm provides the shortest average waiting time for a given set of processes.', 'os', 'intermediate'),
('What is the main principle of Object-Oriented Programming?', '["Encapsulation", "Inheritance", "Polymorphism", "All of the above"]', 'All of the above', 'OOP is based on four main principles: Encapsulation, Inheritance, Polymorphism, and Abstraction.', 'oops', 'beginner');

-- Create update trigger for questions
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_questions_updated_at
    BEFORE UPDATE ON public.questions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_quiz_sessions_updated_at
    BEFORE UPDATE ON public.quiz_sessions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
-- ================================================
-- PHASE 1: CRITICAL FIXES - DATABASE SETUP
-- ================================================

-- 1. Enable pg_cron and pg_net extensions for automated tasks
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- 2. Populate learning_resources table with curated content
INSERT INTO public.learning_resources (topic, title, description, type, url, difficulty, tags) VALUES
('DSA', 'Introduction to Data Structures & Algorithms', 'A comprehensive guide to understanding the fundamentals of data structures and algorithms for beginners.', 'course', 'https://www.geeksforgeeks.org/data-structures/', 'advanced', ARRAY['algorithms', 'data-structures', 'fundamentals']),
('DSA', 'Leetcode Problem Solving Patterns', 'Master patterns to solve algorithm problems efficiently.', 'course', 'https://seanprashad.com/leetcode-patterns/', 'advanced', ARRAY['leetcode', 'patterns', 'problem-solving']),
('DBMS', 'Advanced Database Management Concepts', 'Deep dive into advanced DBMS including normalization, indexing, and optimization.', 'article', 'https://www.geeksforgeeks.org/dbms/', 'intermediate', ARRAY['database', 'normalization', 'indexing']),
('OS', 'Operating Systems: Memory Management', 'Understand memory allocation, paging, and virtual memory in OS.', 'video', 'https://www.geeksforgeeks.org/operating-systems/', 'intermediate', ARRAY['memory', 'paging', 'virtual-memory']),
('Networking', 'Network Protocols and Security', 'Learn key networking protocols and basic cyber security implementations.', 'course', 'https://cs144.github.io/', 'beginner', ARRAY['protocols', 'security', 'tcp-ip']),
('Tools', 'Git & GitHub for Beginners', 'Understand Git version control and manage projects efficiently.', 'video', 'https://www.youtube.com/watch?v=RGOj5yH7evk', 'intermediate', ARRAY['git', 'github', 'version-control']),
('Web Development', 'Full Stack Web Development Roadmap', 'Complete guide to becoming a full-stack developer with modern technologies.', 'course', 'https://roadmap.sh/full-stack', 'intermediate', ARRAY['frontend', 'backend', 'fullstack']),
('Programming', 'Python for Data Science', 'Learn Python programming with focus on data science and machine learning.', 'course', 'https://www.python.org/about/gettingstarted/', 'beginner', ARRAY['python', 'data-science', 'ml']),
('Programming', 'JavaScript: The Complete Guide', 'Master JavaScript from basics to advanced concepts including ES6+.', 'course', 'https://javascript.info/', 'intermediate', ARRAY['javascript', 'es6', 'web']),
('System Design', 'System Design Interview Preparation', 'Learn how to design scalable systems for technical interviews.', 'article', 'https://github.com/donnemartin/system-design-primer', 'advanced', ARRAY['scalability', 'architecture', 'interviews']),
('AI/ML', 'Machine Learning Fundamentals', 'Introduction to machine learning algorithms and applications.', 'course', 'https://www.coursera.org/learn/machine-learning', 'intermediate', ARRAY['ml', 'algorithms', 'ai']),
('Cloud', 'AWS Cloud Practitioner Essentials', 'Get started with Amazon Web Services cloud platform.', 'course', 'https://aws.amazon.com/training/', 'beginner', ARRAY['aws', 'cloud', 'infrastructure'])
ON CONFLICT (id) DO NOTHING;

-- 3. Create helper function for batch leaderboard sync
CREATE OR REPLACE FUNCTION public.batch_sync_leaderboard()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_record RECORD;
BEGIN
  FOR user_record IN 
    SELECT DISTINCT user_id 
    FROM public.quiz_sessions 
    WHERE completed_at IS NOT NULL 
    AND user_id IS NOT NULL
    AND completed_at >= NOW() - INTERVAL '7 days'
  LOOP
    PERFORM public.sync_user_to_leaderboard(user_record.user_id);
  END LOOP;
END;
$$;

-- 4. Schedule automatic leaderboard sync every hour using the helper function
SELECT cron.schedule(
  'sync-leaderboard-hourly',
  '0 * * * *',
  'SELECT public.batch_sync_leaderboard();'
);
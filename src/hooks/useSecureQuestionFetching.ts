import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SimpleQuestion } from './useSimpleQuiz';

export interface SecureQuestionFetchingHook {
  fetchQuestions: (topicId: string) => Promise<SimpleQuestion[]>;
  isLoading: boolean;
  error: string | null;
}

export const useSecureQuestionFetching = (): SecureQuestionFetchingHook => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestions = useCallback(async (topicId: string): Promise<SimpleQuestion[]> => {
    setIsLoading(true);
    setError(null);

    try {
      console.log(`🔍 Fetching secure questions for topic: ${topicId}`);
      
      // First, try to get questions from the database using secure RPC
      const { data: secureQuestions, error: secureError } = await supabase
        .rpc('get_secure_quiz_questions', { 
          p_topic_id: topicId, 
          p_limit: 15 
        });

      if (secureError) {
        console.warn('Secure questions fetch failed:', secureError);
        throw new Error(`Database fetch failed: ${secureError.message}`);
      }

      if (secureQuestions && secureQuestions.length >= 10) {
        console.log(`✅ Using ${secureQuestions.length} database questions`);
        
        // Transform database questions to match our interface
        const transformedQuestions = secureQuestions.map((q: any) => ({
          id: q.id,
          question_text: q.question_text,
          options: Array.isArray(q.options) ? q.options : JSON.parse(q.options || '[]'),
          correct_answer: '', // Will be filled during validation
          topic_id: q.topic_id,
          difficulty: q.difficulty || 'intermediate'
        }));
        
        return transformedQuestions;
      }

      // Fallback: Generate questions using AI if not enough in database
      console.log('📝 Generating new questions via AI...');
      
      const { data: aiQuestions, error: aiError } = await supabase.functions.invoke(
        'generate-quiz-questions',
        {
          body: { topicId, difficulty: 'mixed' }
        }
      );

      if (aiError) {
        console.error('AI generation error:', aiError);
        throw new Error(`Failed to generate questions: ${aiError.message}`);
      }

      if (aiQuestions?.questions && aiQuestions.questions.length > 0) {
        console.log(`✅ Using ${aiQuestions.questions.length} AI-generated questions`);
        return aiQuestions.questions;
      } else {
        throw new Error('No questions could be generated for this topic');
      }
      
    } catch (error) {
      console.error('❌ Error fetching questions:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch questions';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    fetchQuestions,
    isLoading,
    error
  };
};
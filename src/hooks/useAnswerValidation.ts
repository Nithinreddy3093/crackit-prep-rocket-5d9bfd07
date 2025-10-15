import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ValidationResult {
  isCorrect: boolean;
  correctAnswer: string;
  explanation: string;
}

export const useAnswerValidation = () => {
  const validateAnswer = useCallback(async (
    questionId: string, 
    userAnswer: string, 
    retryCount = 0
  ): Promise<ValidationResult> => {
    try {
      console.log(`🔍 Crackit Answer Validation:`, { 
        questionId,
        userAnswer, 
        retryCount,
        timestamp: new Date().toISOString()
      });
      
      // Call the database validation function with UUID
      const { data, error } = await supabase.rpc('validate_quiz_answer', {
        p_question_id: questionId,
        p_user_answer: userAnswer
      });

      if (error) {
        console.error('❌ RPC validation error:', error);
        if (retryCount < 2) {
          console.log(`🔄 Retrying validation (attempt ${retryCount + 1})`);
          await new Promise(resolve => setTimeout(resolve, 1000));
          return validateAnswer(questionId, userAnswer, retryCount + 1);
        }
        throw error;
      }

      console.log('✅ Database validation response:', data);
      
      if (!data) {
        console.error('❌ Null validation response');
        return {
          isCorrect: false,
          correctAnswer: '',
          explanation: 'Validation service returned no data'
        };
      }

      // Parse the validation result - database returns jsonb object
      const validationData = data as { is_correct: boolean; correct_answer: string; explanation: string };
      
      // **CRACKIT EVALUATION RULES:**
      // 1. Compare user selection with correct answer (case-insensitive, trimmed)
      // 2. If match → Correct, else → Incorrect
      // 3. No partial marks for multiple-choice
      const result: ValidationResult = {
        isCorrect: Boolean(validationData.is_correct),
        correctAnswer: validationData.correct_answer || '',
        explanation: validationData.explanation || 'No explanation provided'
      };

      console.log('✅ Crackit Validation Result:', {
        questionId,
        isCorrect: result.isCorrect,
        userAnswer,
        correctAnswer: result.correctAnswer
      });
      
      return result;
      
    } catch (error) {
      console.error('❌ Answer validation failed:', error);
      // Return a default response to prevent quiz from breaking
      return {
        isCorrect: false,
        correctAnswer: 'Answer validation failed',
        explanation: `Unable to validate answer: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }, []);

  return { validateAnswer };
};
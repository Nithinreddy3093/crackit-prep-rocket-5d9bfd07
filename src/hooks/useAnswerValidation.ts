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
      console.log(`🔍 Validating answer for question ${questionId}:`, { 
        userAnswer, 
        retryCount,
        questionIdType: typeof questionId,
        questionIdLength: questionId.length
      });
      
      const { data, error } = await supabase.rpc('validate_quiz_answer', {
        p_question_id: questionId,
        p_user_answer: userAnswer
      });

      if (error) {
        console.error('Validation error:', error);
        if (retryCount < 2) {
          console.log(`🔄 Retrying validation (attempt ${retryCount + 1})`);
          await new Promise(resolve => setTimeout(resolve, 1000));
          return validateAnswer(questionId, userAnswer, retryCount + 1);
        }
        throw error;
      }

      console.log('✅ Raw validation result:', data);
      
      if (!data) {
        console.error('Null validation response');
        return {
          isCorrect: false,
          correctAnswer: 'No response from validation',
          explanation: 'Validation service returned no data'
        };
      }

      // Handle both direct data and wrapped data structures
      const validationData = Array.isArray(data) && data.length > 0 ? data[0] : data;
      
      if (typeof (validationData as any).is_correct === 'undefined') {
        console.error('Invalid validation response structure:', validationData);
        return {
          isCorrect: false,
          correctAnswer: 'Invalid response structure',
          explanation: 'Validation service response is malformed'
        };
      }
      
      const result = {
        isCorrect: Boolean((validationData as any).is_correct),
        correctAnswer: (validationData as any).correct_answer || '',
        explanation: (validationData as any).explanation || ''
      };

      console.log('📊 Processed validation result:', result);
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

/**
 * Utility functions for consistent answer comparison across the quiz system
 */

export interface AnswerComparisonResult {
  isCorrect: boolean;
  normalizedUserAnswer: string;
  normalizedCorrectAnswer: string;
  comparisonMethod: 'text' | 'index';
}

/**
 * Normalize text for comparison by trimming whitespace and converting to lowercase
 */
export const normalizeText = (text: string | null | undefined): string => {
  if (!text || typeof text !== 'string') return '';
  return text.trim().toLowerCase();
};

/**
 * Determine if correctAnswer appears to be an index or actual text
 */
export const isIndexBasedAnswer = (correctAnswer: any, options: string[]): boolean => {
  // Check if it's a number or numeric string
  const asNumber = Number(correctAnswer);
  return !isNaN(asNumber) && 
         asNumber >= 0 && 
         asNumber < options.length && 
         Number.isInteger(asNumber);
};

/**
 * Get the actual correct answer text, handling both index and text formats
 */
export const getCorrectAnswerText = (correctAnswer: any, options: string[]): string => {
  if (isIndexBasedAnswer(correctAnswer, options)) {
    const index = Number(correctAnswer);
    return options[index] || '';
  }
  return String(correctAnswer || '');
};

/**
 * Compare user answer with correct answer using consistent logic
 */
export const compareAnswers = (
  userAnswer: string | null | undefined,
  correctAnswer: any,
  options: string[],
  questionId?: string
): AnswerComparisonResult => {
  const normalizedUserAnswer = normalizeText(userAnswer);
  
  // Handle empty user answer
  if (!normalizedUserAnswer) {
    return {
      isCorrect: false,
      normalizedUserAnswer: '',
      normalizedCorrectAnswer: getCorrectAnswerText(correctAnswer, options),
      comparisonMethod: isIndexBasedAnswer(correctAnswer, options) ? 'index' : 'text'
    };
  }

  // Get the actual correct answer text
  const correctAnswerText = getCorrectAnswerText(correctAnswer, options);
  const normalizedCorrectAnswer = normalizeText(correctAnswerText);
  
  // Perform comparison
  const isCorrect = normalizedUserAnswer === normalizedCorrectAnswer;
  
  // Log for debugging if questionId provided
  if (questionId) {
    console.log(`Answer comparison for ${questionId}:`, {
      userAnswer,
      correctAnswer,
      normalizedUserAnswer,
      normalizedCorrectAnswer,
      isCorrect,
      isIndexBased: isIndexBasedAnswer(correctAnswer, options)
    });
  }
  
  return {
    isCorrect,
    normalizedUserAnswer,
    normalizedCorrectAnswer,
    comparisonMethod: isIndexBasedAnswer(correctAnswer, options) ? 'index' : 'text'
  };
};

/**
 * Validate question structure before use
 */
export const validateQuestionStructure = (question: any): boolean => {
  return !!(
    question &&
    question.id &&
    question.text &&
    Array.isArray(question.options) &&
    question.options.length > 0 &&
    question.correctAnswer !== undefined &&
    question.correctAnswer !== null
  );
};

/**
 * Remove duplicate questions from an array based on question ID
 */
export const deduplicateQuestions = (questions: any[]): any[] => {
  const seen = new Set();
  return questions.filter(question => {
    if (!question?.id || seen.has(question.id)) {
      return false;
    }
    seen.add(question.id);
    return validateQuestionStructure(question);
  });
};

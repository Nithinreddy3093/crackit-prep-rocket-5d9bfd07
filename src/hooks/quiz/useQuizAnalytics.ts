
export interface QuizAnalytics {
  correctAnswers: number;
  incorrectQuestions: number;
  skippedQuestions: number;
  totalQuestions: number;
}

export function useQuizAnalytics() {
  const calculateQuizAnalytics = (questionDetails: {
    questionId: string;
    question: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
  }[], correctAnswers: number, totalQuestions: number): QuizAnalytics => {
    const skippedQuestions = questionDetails.filter(q => q.userAnswer === '').length;
    const incorrectQuestions = questionDetails.filter(q => !q.isCorrect && q.userAnswer !== '').length;
    
    return {
      correctAnswers,
      incorrectQuestions,
      skippedQuestions,
      totalQuestions
    };
  };

  return {
    calculateQuizAnalytics
  };
}

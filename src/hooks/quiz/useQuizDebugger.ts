import { useEffect, useCallback } from 'react';

interface QuestionDetail {
  questionId: string;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

interface QuizDebuggerProps {
  questions: any[];
  currentQuestionIndex: number;
  selectedAnswer: number | null;
  correctAnswers: number;
  questionDetails: QuestionDetail[];
  userAnswers: Record<string, number>;
  quizStarted: boolean;
  quizCompleted: boolean;
  topicId?: string;
}

/**
 * Hook for comprehensive quiz debugging and monitoring
 */
export function useQuizDebugger({
  questions,
  currentQuestionIndex,
  selectedAnswer,
  correctAnswers,
  questionDetails,
  userAnswers,
  quizStarted,
  quizCompleted,
  topicId
}: QuizDebuggerProps) {
  
  // Debug quiz state changes
  useEffect(() => {
    if (quizStarted) {
      console.log('🎯 QUIZ STATE DEBUG:', {
        topicId,
        totalQuestions: questions.length,
        currentIndex: currentQuestionIndex,
        selectedAnswer,
        correctAnswers,
        questionDetailsCount: questionDetails.length,
        userAnswersCount: Object.keys(userAnswers).length,
        quizCompleted
      });
    }
  }, [
    quizStarted,
    currentQuestionIndex,
    selectedAnswer,
    correctAnswers,
    questionDetails.length,
    Object.keys(userAnswers).length,
    quizCompleted,
    topicId,
    questions.length
  ]);

  // Debug question details consistency
  useEffect(() => {
    if (questionDetails.length > 0) {
      const uniqueQuestionIds = new Set(questionDetails.map(d => d.questionId));
      if (uniqueQuestionIds.size !== questionDetails.length) {
        console.error('🚨 DUPLICATE QUESTION DETAILS DETECTED:', {
          totalDetails: questionDetails.length,
          uniqueIds: uniqueQuestionIds.size,
          duplicates: questionDetails.length - uniqueQuestionIds.size
        });
      }

      // Check for empty answers
      const emptyAnswers = questionDetails.filter(d => !d.userAnswer || d.userAnswer.trim() === '');
      if (emptyAnswers.length > 0) {
        console.warn('⚠️ EMPTY USER ANSWERS FOUND:', {
          count: emptyAnswers.length,
          questionIds: emptyAnswers.map(d => d.questionId)
        });
      }

      // Verify correct answer count
      const actualCorrectCount = questionDetails.filter(d => d.isCorrect && d.userAnswer).length;
      if (actualCorrectCount !== correctAnswers) {
        console.error('🔥 SCORE MISMATCH DETECTED:', {
          reportedCorrect: correctAnswers,
          actualCorrect: actualCorrectCount,
          difference: Math.abs(actualCorrectCount - correctAnswers)
        });
      }
    }
  }, [questionDetails, correctAnswers]);

  // Debug localStorage state
  const debugLocalStorage = useCallback(() => {
    const inProgressQuiz = localStorage.getItem('inProgressQuiz');
    const lastQuizResults = localStorage.getItem('lastQuizResults');
    
    console.log('💾 LOCALSTORAGE DEBUG:', {
      hasInProgress: !!inProgressQuiz,
      hasLastResults: !!lastQuizResults,
      inProgressSize: inProgressQuiz ? inProgressQuiz.length : 0,
      resultsSize: lastQuizResults ? lastQuizResults.length : 0
    });

    if (inProgressQuiz) {
      try {
        const parsed = JSON.parse(inProgressQuiz);
        console.log('📋 IN-PROGRESS QUIZ DATA:', {
          topicId: parsed.topicId,
          currentQuestionIndex: parsed.currentQuestionIndex,
          userAnswersCount: Object.keys(parsed.userAnswers || {}).length,
          questionIdsCount: parsed.questionIds?.length || 0
        });
      } catch (e) {
        console.error('❌ Failed to parse in-progress quiz data:', e);
      }
    }
  }, []);

  // Debug quiz completion
  useEffect(() => {
    if (quizCompleted) {
      console.log('🏁 QUIZ COMPLETION DEBUG:', {
        totalQuestions: questions.length,
        questionDetailsCount: questionDetails.length,
        userAnswersCount: Object.keys(userAnswers).length,
        correctAnswers,
        finalScore: Math.round((correctAnswers / questions.length) * 100)
      });

      debugLocalStorage();

      // Validate completion data
      if (questionDetails.length === 0) {
        console.error('🚨 CRITICAL: Quiz completed with no question details!');
      }

      if (questionDetails.length !== questions.length) {
        console.warn('⚠️ Question details count mismatch:', {
          expected: questions.length,
          actual: questionDetails.length
        });
      }
    }
  }, [quizCompleted, questions.length, questionDetails.length, Object.keys(userAnswers).length, correctAnswers, debugLocalStorage]);

  return {
    debugLocalStorage
  };
}
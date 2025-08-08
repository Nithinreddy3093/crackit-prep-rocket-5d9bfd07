
import { useState, useEffect, useCallback } from 'react';
import { Question } from "@/services/questionService";
import { compareAnswers, deduplicateQuestions } from '@/utils/answerComparison';

export interface QuestionDetail {
  questionId: string;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

export interface InProgressQuiz {
  topicId: string;
  currentQuestionIndex: number;
  userAnswers: Record<string, number>; // questionId -> selectedOptionIndex
  startTime: number;
  questionIds: string[];
}

export function useQuestionNavigation(
  questions: Question[], 
  userId?: string, 
  topicId?: string
) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [questionDetails, setQuestionDetails] = useState<QuestionDetail[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});

  const currentQuestion = questions[currentQuestionIndex];

  // Initialize user answers when questions change
  useEffect(() => {
    if (questions.length > 0) {
      // Deduplicate questions to prevent issues
      const uniqueQuestions = deduplicateQuestions(questions);
      if (uniqueQuestions.length !== questions.length) {
        console.warn('Duplicate questions detected and removed:', questions.length - uniqueQuestions.length);
      }
      
      setUserAnswers({});
      setCorrectAnswers(0);
      setQuestionDetails([]);
      console.log('Quiz initialized with unique questions:', uniqueQuestions.length);
    }
  }, [questions]);

  // When current question changes, restore selected answer if exists
  useEffect(() => {
    if (currentQuestion && userAnswers[currentQuestion.id] !== undefined) {
      setSelectedAnswer(userAnswers[currentQuestion.id]);
    } else {
      setSelectedAnswer(null);
    }
  }, [currentQuestionIndex, userAnswers, currentQuestion]);

  // Restore progress from localStorage
  useEffect(() => {
    if (userId && topicId) {
      const inProgressQuiz = localStorage.getItem('inProgressQuiz');
      if (inProgressQuiz) {
        try {
          const quizData: InProgressQuiz = JSON.parse(inProgressQuiz);
          if (quizData.topicId === topicId) {
            console.log('Restoring in-progress quiz:', quizData);
            setCurrentQuestionIndex(quizData.currentQuestionIndex);
            setUserAnswers(quizData.userAnswers || {});
            
            // Recalculate correct answers using improved comparison
            let correct = 0;
            questions.forEach(q => {
              if (quizData.userAnswers[q.id] !== undefined) {
                const userAnswerText = q.options[quizData.userAnswers[q.id]];
                const comparison = compareAnswers(userAnswerText, q.correctAnswer, q.options, q.id);
                if (comparison.isCorrect) {
                  correct++;
                }
              }
            });
            setCorrectAnswers(correct);
            console.log('Restored correct answers count:', correct);
          }
        } catch (e) {
          console.error('Error parsing in-progress quiz:', e);
        }
      }
    }
  }, [userId, topicId, questions]);

  const handleAnswerSelect = useCallback((answerIndex: number) => {
    if (!currentQuestion) return;
    
    console.log('🔘 ANSWER SELECTED:', {
      questionId: currentQuestion.id,
      selectedIndex: answerIndex,
      selectedOption: currentQuestion.options[answerIndex],
      correctAnswer: currentQuestion.correctAnswer
    });
    
    setSelectedAnswer(answerIndex);
    
    // Update userAnswers with question ID as key
    const updatedUserAnswers = {
      ...userAnswers,
      [currentQuestion.id]: answerIndex
    };
    setUserAnswers(updatedUserAnswers);
    
    // Recalculate total correct answers using improved comparison
    let totalCorrect = 0;
    const answerBreakdown: Array<{questionId: string, isCorrect: boolean, userAnswer: string, correctAnswer: string}> = [];
    
    Object.entries(updatedUserAnswers).forEach(([questionId, selectedIndex]) => {
      const question = questions.find(q => q.id === questionId);
      if (question) {
        const userAnswerText = question.options[selectedIndex];
        const comparison = compareAnswers(userAnswerText, question.correctAnswer, question.options, questionId);
        
        answerBreakdown.push({
          questionId,
          isCorrect: comparison.isCorrect,
          userAnswer: userAnswerText,
          correctAnswer: comparison.normalizedCorrectAnswer
        });
        
        if (comparison.isCorrect) {
          totalCorrect++;
        }
      }
    });
    
    console.log('📊 UPDATED SCORE CALCULATION:', {
      totalAnswered: Object.keys(updatedUserAnswers).length,
      totalCorrect,
      answerBreakdown
    });
    
    setCorrectAnswers(totalCorrect);
    
    // Save progress to localStorage
    if (userId && topicId) {
      const quizData: InProgressQuiz = {
        topicId,
        currentQuestionIndex,
        userAnswers: updatedUserAnswers,
        startTime: Date.now() - ((currentQuestionIndex + 1) * 30 * 1000), // Estimated start time
        questionIds: questions.map(q => q.id)
      };
      localStorage.setItem('inProgressQuiz', JSON.stringify(quizData));
      console.log('💾 Progress saved to localStorage');
    }
  }, [currentQuestion, currentQuestionIndex, questions, topicId, userId, userAnswers]);

  const goToNextQuestion = useCallback(() => {
    if (!currentQuestion) return false;
    
    console.log('⏭️ PROCESSING NEXT QUESTION:', {
      currentQuestionId: currentQuestion.id,
      selectedAnswer,
      hasUserAnswer: selectedAnswer !== null
    });
    
    // Create question detail with improved comparison
    const userAnswerText = selectedAnswer !== null ? currentQuestion.options[selectedAnswer] : '';
    const comparison = compareAnswers(userAnswerText, currentQuestion.correctAnswer, currentQuestion.options, currentQuestion.id);
    
    const detail: QuestionDetail = {
      questionId: currentQuestion.id,
      question: currentQuestion.text,
      userAnswer: userAnswerText,
      correctAnswer: comparison.normalizedCorrectAnswer,
      isCorrect: comparison.isCorrect
    };
    
    console.log('📝 QUESTION DETAIL CREATED:', {
      questionId: detail.questionId,
      userAnswer: detail.userAnswer,
      correctAnswer: detail.correctAnswer,
      isCorrect: detail.isCorrect,
      comparisonMethod: comparison.comparisonMethod
    });
    
    // Check if this question already exists in details and update/add accordingly
    const existingDetailIndex = questionDetails.findIndex(d => d.questionId === currentQuestion.id);
    let updatedDetails;
    if (existingDetailIndex >= 0) {
      updatedDetails = [...questionDetails];
      updatedDetails[existingDetailIndex] = detail;
      console.log('🔄 Updated existing question detail:', currentQuestion.id);
    } else {
      updatedDetails = [...questionDetails, detail];
      console.log('➕ Added new question detail:', currentQuestion.id);
    }
    setQuestionDetails(updatedDetails);
    
    console.log('📋 QUESTION DETAILS STATUS:', {
      totalDetails: updatedDetails.length,
      detailsIds: updatedDetails.map(d => d.questionId),
      currentQuestionIndex: currentQuestionIndex + 1,
      totalQuestions: questions.length
    });
    
    setSelectedAnswer(null);
    
    if (currentQuestionIndex < questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      
      // Update progress in localStorage
      if (userId && topicId) {
        const quizData: InProgressQuiz = {
          topicId,
          currentQuestionIndex: nextIndex,
          userAnswers,
          startTime: Date.now() - ((nextIndex + 1) * 30 * 1000),
          questionIds: questions.map(q => q.id)
        };
        localStorage.setItem('inProgressQuiz', JSON.stringify(quizData));
        console.log('💾 Updated progress for next question');
      }
      
      return false;
    } else {
      // Final evaluation before completion
      console.log('🏁 QUIZ COMPLETION - FINAL EVALUATION:', {
        totalQuestions: questions.length,
        answeredQuestions: Object.keys(userAnswers).length,
        correctAnswers,
        finalQuestionDetailsCount: updatedDetails.length,
        questionDetailsBreakdown: updatedDetails.map(d => ({
          id: d.questionId,
          correct: d.isCorrect,
          answered: d.userAnswer !== ''
        }))
      });
      
      return true;
    }
  }, [currentQuestionIndex, questions.length, selectedAnswer, currentQuestion, userAnswers, userId, topicId, questionDetails, correctAnswers]);

  const resetQuestionState = useCallback(() => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setCorrectAnswers(0);
    setQuestionDetails([]);
    setUserAnswers({});
    localStorage.removeItem('inProgressQuiz');
    
    console.log('Quiz state reset');
  }, []);

  return {
    currentQuestionIndex,
    selectedAnswer,
    correctAnswers,
    questionDetails,
    userAnswers,
    currentQuestion,
    setQuestionDetails,
    handleAnswerSelect,
    goToNextQuestion,
    resetQuestionState
  };
}

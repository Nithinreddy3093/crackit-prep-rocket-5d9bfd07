import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export interface SimpleQuestion {
  id: string;
  question_text: string;
  options: string[];
  correct_answer: string;
  explanation?: string;
  topic_id: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface QuizAnswerDetail {
  questionId: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

interface QuizSession {
  id: string;
  user_id: string;
  topic_id: string;
  started_at: string;
  completed_at?: string;
  total_questions: number;
  correct_answers: number;
  score_percentage: number;
  time_spent_ms: number;
  question_details: any; // Using any to handle JSONB data
}

export const useSimpleQuiz = (topicId?: string) => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<SimpleQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<(string | null)[]>([]);
  const [questionDetails, setQuestionDetails] = useState<QuizAnswerDetail[]>([]);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Validation states
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    isCorrect?: boolean;
    correctAnswer?: string;
    explanation?: string;
  } | null>(null);
  
  // Timer
  const [startTime, setStartTime] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  
  // Current quiz session
  const [currentSession, setCurrentSession] = useState<QuizSession | null>(null);

  // Format time helper
  const formatTime = useCallback((ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  // Update timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (quizStarted && !quizCompleted && startTime > 0) {
      interval = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [quizStarted, quizCompleted, startTime]);

  // Load questions using secure functions
  const loadQuestions = useCallback(async (topicId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('🔍 Loading questions for topic:', topicId);
      
      // Use secure function to get questions (without answers)
      const { data: secureQuestions, error: secureError } = await supabase
        .rpc('get_secure_quiz_questions', {
          p_topic_id: topicId,
          p_limit: 15
        });

      if (secureError) {
        console.error('Error fetching secure questions:', secureError);
        throw new Error('Failed to fetch questions securely');
      }

      if (secureQuestions && secureQuestions.length >= 10) {
        console.log('✅ Using secure questions from database');
        
        // Transform secure questions (note: no correct_answer available)
        const transformedQuestions: SimpleQuestion[] = secureQuestions.map(q => ({
          id: q.id,
          question_text: q.question_text,
          options: Array.isArray(q.options) ? q.options : JSON.parse(q.options as string),
          correct_answer: '', // Not available in secure fetch
          explanation: undefined, // Not available in secure fetch
          topic_id: q.topic_id,
          difficulty: q.difficulty as 'beginner' | 'intermediate' | 'advanced'
        }));
        
        setQuestions(transformedQuestions);
        setUserAnswers(new Array(transformedQuestions.length).fill(null));
        return;
      }

      // Generate new questions using AI
      console.log('🤖 Generating new questions using AI...');
      
      const response = await supabase.functions.invoke('generate-quiz-questions', {
        body: { topicId, difficulty: 'mixed' }
      });

      if (response.error) {
        console.error('Edge function error:', response.error);
        
        // Provide more specific error messages
        const errorMessage = response.error.message || 'Unknown error';
        
        if (errorMessage.includes('Invalid topic')) {
          throw new Error(`Topic "${topicId}" is not available. Please select a different topic.`);
        }
        
        if (errorMessage.includes('No topic ID')) {
          throw new Error('No topic selected. Please go back and select a topic.');
        }
        
        if (response.error.message?.includes('rate limit') || errorMessage.includes('429')) {
          throw new Error('Too many requests. Please wait a moment and try again.');
        }
        
        throw new Error(`Failed to generate questions: ${errorMessage}`);
      }

      if (!response.data) {
        throw new Error('No response data received from question generator. Please try again.');
      }

      const { questions: aiQuestions, timeLimit } = response.data;
      
      if (!aiQuestions || aiQuestions.length === 0) {
        throw new Error('No questions generated by AI service');
      }

      console.log(`🤖 AI generated ${aiQuestions.length} questions, now checking database...`);

      // After AI generation, try to fetch from database again as questions should be stored
      const { data: freshQuestions, error: freshError } = await supabase
        .rpc('get_secure_quiz_questions', {
          p_topic_id: topicId,
          p_limit: 15
        });

      if (!freshError && freshQuestions && freshQuestions.length >= 10) {
        console.log('✅ Using freshly stored questions from database');
        
        const transformedQuestions: SimpleQuestion[] = freshQuestions.map(q => ({
          id: q.id,
          question_text: q.question_text,
          options: Array.isArray(q.options) ? q.options : JSON.parse(q.options as string),
          correct_answer: '', // Not available in secure fetch
          explanation: undefined, // Not available in secure fetch
          topic_id: q.topic_id,
          difficulty: q.difficulty as 'beginner' | 'intermediate' | 'advanced'
        }));
        
        setQuestions(transformedQuestions);
        setUserAnswers(new Array(transformedQuestions.length).fill(null));
        return;
      }

      // Fallback: Use AI questions directly (remove sensitive data for client)
      const quizQuestions = aiQuestions.slice(0, 15).map((q: any) => ({
        id: q.id,
        question_text: q.question_text,
        options: q.options,
        correct_answer: '', // Remove correct answer from client
        explanation: undefined, // Remove explanation from client
        topic_id: q.topic_id,
        difficulty: q.difficulty || 'intermediate'
      }));
      
      console.log('✅ Using AI-generated questions directly:', quizQuestions.length);
      setQuestions(quizQuestions);
      setUserAnswers(new Array(quizQuestions.length).fill(null));
      
    } catch (err) {
      console.error('❌ Error loading questions:', err);
      
      let errorMessage = 'Failed to load questions. Please try again.';
      
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      // Add user-friendly guidance based on error type
      if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      } else if (errorMessage.includes('Invalid topic')) {
        errorMessage = `${errorMessage} Please go back to the topics page and select a valid topic.`;
      }
      
      setError(errorMessage);
      toast({
        title: "Error Loading Quiz",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Start quiz
  const startQuiz = useCallback(async () => {
    if (!user || !topicId) {
      toast({
        title: "Authentication required",
        description: "Please log in to start the quiz",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      
      // Create quiz session in database
      const { data: session, error: sessionError } = await supabase
        .from('quiz_sessions')
        .insert({
          user_id: user.id,
          topic_id: topicId,
          total_questions: questions.length,
          correct_answers: 0,
          score_percentage: 0,
          time_spent_ms: 0,
          question_details: []
        })
        .select()
        .single();

      if (sessionError) {
        console.error('Error creating quiz session:', sessionError);
        throw new Error('Failed to start quiz session');
      }

      setCurrentSession(session);
      setQuizStarted(true);
      setStartTime(Date.now());
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
      setQuestionDetails([]);
      setCorrectAnswersCount(0);
      
      console.log('🚀 Quiz started:', session.id);
      
    } catch (err) {
      console.error('❌ Error starting quiz:', err);
      toast({
        title: "Error starting quiz",
        description: err instanceof Error ? err.message : 'Failed to start quiz',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, topicId, questions.length]);

  // Validate answer using secure function with retry logic
  const validateAnswer = useCallback(async (questionId: string, userAnswer: string, retryCount = 0) => {
    try {
      console.log(`🔍 Validating answer for question: ${questionId}`, {
        questionId,
        userAnswer,
        retryCount,
        timestamp: new Date().toISOString()
      });
      
      const { data, error } = await supabase
        .rpc('validate_quiz_answer', {
          p_question_id: questionId,
          p_user_answer: userAnswer
        });

      if (error) {
        console.error('❌ RPC validation error:', error);
        
        // Retry once if it's a network or temporary error
        if (retryCount < 1 && (error.message.includes('network') || error.message.includes('timeout'))) {
          console.log('🔄 Retrying answer validation...');
          await new Promise(resolve => setTimeout(resolve, 1000));
          return validateAnswer(questionId, userAnswer, retryCount + 1);
        }
        
        return { 
          isCorrect: false, 
          correct_answer: '', 
          explanation: 'Unable to validate answer. Please try again.',
          error: error.message 
        };
      }

      // Ensure we have data
      if (!data) {
        console.error('❌ No data returned from validation');
        return { 
          isCorrect: false, 
          correct_answer: '', 
          explanation: 'No response from validation service'
        };
      }

      // Handle both direct object and array response formats
      const validationData = Array.isArray(data) && data.length > 0 ? data[0] : data;
      
      // Extract properties from server response
      const rawResult = validationData as { 
        is_correct?: boolean; 
        correct_answer?: string; 
        explanation?: string; 
        error?: string; 
      };
      
      if (rawResult?.error) {
        console.error('❌ Validation result error:', rawResult.error);
        return { 
          isCorrect: false, 
          correct_answer: rawResult.correct_answer || '', 
          explanation: rawResult.error 
        };
      }
      
      // Transform server response to client format (is_correct -> isCorrect)
      const transformedResult = {
        isCorrect: Boolean(rawResult.is_correct),
        correct_answer: rawResult.correct_answer || '',
        explanation: rawResult.explanation || ''
      };
      
      console.log(`✅ Answer validation successful:`, {
        questionId,
        userAnswer,
        serverResponse: rawResult,
        transformedResult,
        timestamp: new Date().toISOString()
      });
      
      return transformedResult;
      
    } catch (err) {
      console.error('❌ Error in answer validation:', err);
      
      // Retry once for unexpected errors
      if (retryCount < 1) {
        console.log('🔄 Retrying answer validation after error...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        return validateAnswer(questionId, userAnswer, retryCount + 1);
      }
      
      return { 
        isCorrect: false, 
        correct_answer: '', 
        explanation: 'Validation failed. Please try again.',
        error: err instanceof Error ? err.message : 'Unknown error'
      };
    }
  }, []);

  // Handle answer selection with immediate validation
  const handleAnswerSelect = useCallback(async (answer: string) => {
    setSelectedAnswer(answer);
    setValidationResult(null);
    
    // Update user answers array
    setUserAnswers(prev => {
      const updated = [...prev];
      updated[currentQuestionIndex] = answer;
      return updated;
    });

    // Immediate validation for feedback
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion?.id) {
      setIsValidating(true);
      try {
        const result = await validateAnswer(currentQuestion.id, answer);
        setValidationResult({
          isCorrect: result.isCorrect,
          correctAnswer: result.correct_answer,
          explanation: result.explanation
        });
      } catch (error) {
        console.error('Error in immediate validation:', error);
      } finally {
        setIsValidating(false);
      }
    }
  }, [currentQuestionIndex, questions, validateAnswer]);

  // Go to next question
  const goToNextQuestion = useCallback(async () => {
    if (!selectedAnswer || !questions[currentQuestionIndex]) return;

    const currentQuestion = questions[currentQuestionIndex];
    
    console.log('📝 Processing question answer:', {
      questionId: currentQuestion.id,
      userAnswer: selectedAnswer,
      questionIndex: currentQuestionIndex
    });
    
    // Validate answer using secure function
    const validationResult = await validateAnswer(currentQuestion.id, selectedAnswer);
    const isCorrect = validationResult.isCorrect; // Use transformed property name
    
    console.log('📊 Question validation complete:', {
      questionId: currentQuestion.id,
      isCorrect,
      correctAnswer: validationResult.correct_answer,
      currentCorrectCount: correctAnswersCount
    });
    
    // Add to question details with correct answer from server
    const questionDetail: QuizAnswerDetail = {
      questionId: currentQuestion.id,
      userAnswer: selectedAnswer,
      correctAnswer: validationResult.correct_answer,
      isCorrect
    };
    
    setQuestionDetails(prev => {
      const updated = [...prev, questionDetail];
      console.log('📋 Updated question details:', updated.length, 'total questions processed');
      return updated;
    });
    
    if (isCorrect) {
      setCorrectAnswersCount(prev => {
        const newCount = prev + 1;
        console.log('✅ Correct answer! New count:', newCount);
        return newCount;
      });
    } else {
      console.log('❌ Incorrect answer. Count remains:', correctAnswersCount);
    }

    // Move to next question or complete quiz
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setValidationResult(null); // Clear validation for next question
    } else {
      console.log('🏁 Quiz complete, finishing...');
      completeQuiz();
    }
  }, [selectedAnswer, questions, currentQuestionIndex, validateAnswer, correctAnswersCount]);

  // Complete quiz - Simplified version using new secure functions
  const completeQuiz = useCallback(async () => {
    if (!user?.id || !topicId) {
      console.error('[completeQuiz] Missing user ID or topic ID');
      toast({
        title: "Error",
        description: "Unable to save quiz results. Please log in and try again.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const score = Math.round((correctAnswersCount / questions.length) * 100);

    try {
      console.log('[completeQuiz] Starting simplified quiz completion', {
        userId: user.id,
        topicId,
        score,
        correctAnswers: correctAnswersCount,
        totalQuestions: questions.length,
        timeSpentMs: elapsedTime
      });

      // Step 1: Save quiz result using new secure function
      console.log('[completeQuiz] Saving quiz result...');
      const { data: resultId, error: resultError } = await supabase.rpc('save_quiz_result', {
        p_user_id: user.id,
        p_topic: topicId,
        p_score: score,
        p_completion_time: elapsedTime,
        p_question_details: questionDetails as any
      });

      if (resultError) {
        console.error('[completeQuiz] Failed to save quiz result:', resultError);
        throw new Error('Failed to save quiz results');
      }

      console.log('[completeQuiz] Quiz result saved successfully:', resultId);

      // Step 2: Complete the quiz session using new secure function
      if (currentSession?.id) {
        console.log('[completeQuiz] Completing quiz session:', currentSession.id);
        const { data: sessionUpdated, error: sessionError } = await supabase.rpc('complete_quiz_session', {
          p_session_id: currentSession.id,
          p_user_id: user.id,
          p_completed_at: new Date().toISOString(),
          p_correct_answers: correctAnswersCount,
          p_total_questions: questions.length,
          p_score_percentage: score,
          p_time_spent_ms: elapsedTime,
          p_question_details: questionDetails as any
        });

        if (sessionError) {
          console.error('[completeQuiz] Failed to complete session:', sessionError);
        } else {
          console.log('[completeQuiz] Session completed successfully');
        }
      }

      // Step 3: Track performance metrics using new secure function
      console.log('[completeQuiz] Tracking performance...');
      const { error: perfError } = await supabase.rpc('track_quiz_performance', {
        p_user_id: user.id,
        p_topic: topicId,
        p_score: score,
        p_completion_time: elapsedTime
      });

      if (perfError) {
        console.error('[completeQuiz] Failed to track performance:', perfError);
        // Don't throw - performance tracking is secondary
      } else {
        console.log('[completeQuiz] Performance tracked successfully');
      }

      // Success!
      toast({
        title: "Quiz Completed! 🎉",
        description: `You scored ${score}% with ${correctAnswersCount} out of ${questions.length} correct answers!`,
      });

      setQuizCompleted(true);
      
    } catch (error: any) {
      console.error('[completeQuiz] Error during quiz completion:', error);
      
      // Mark as completed so user can see results
      setQuizCompleted(true);
      
      toast({
        title: "Failed to Save Results",
        description: error?.message || "There was an error saving your quiz results. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, topicId, correctAnswersCount, questions.length, elapsedTime, questionDetails, currentSession]);

  // Reset quiz
  const resetQuiz = useCallback(() => {
    setQuizStarted(false);
    setQuizCompleted(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setUserAnswers([]);
    setQuestionDetails([]);
    setCorrectAnswersCount(0);
    setStartTime(0);
    setElapsedTime(0);
    setCurrentSession(null);
    setError(null);
    setIsValidating(false);
    setValidationResult(null);
  }, []);

  // Load questions when topic changes
  useEffect(() => {
    if (topicId && !quizStarted) {
      loadQuestions(topicId);
    }
  }, [topicId, quizStarted, loadQuestions]);

  return {
    // State
    questions,
    currentQuestion: questions[currentQuestionIndex] || null,
    currentQuestionIndex,
    totalQuestions: questions.length,
    selectedAnswer,
    userAnswers,
    questionDetails,
    correctAnswersCount,
    quizStarted,
    quizCompleted,
    isLoading,
    error,
    elapsedTime,
    
    // Actions
    handleAnswerSelect,
    goToNextQuestion,
    startQuiz,
    completeQuiz,
    resetQuiz,
    
    // Validation
    isValidating,
    validationResult,

    // Utils
    formatTime,
    
    // Computed
    scorePercentage: questions.length > 0 ? Math.round((correctAnswersCount / questions.length) * 100) : 0
  };
};
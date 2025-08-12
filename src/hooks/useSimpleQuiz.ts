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
  
  // Quiz states
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
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
        throw new Error('Failed to generate questions');
      }

      const { questions: aiQuestions, timeLimit } = response.data;
      
      if (!aiQuestions || aiQuestions.length === 0) {
        throw new Error('No questions generated');
      }

      // Note: Questions are stored in database by the edge function
      // We don't store them here since direct table access is now restricted

      // Use a subset for the quiz (10-15 questions)
      // Transform to remove sensitive data for client
      const quizQuestions = aiQuestions.slice(0, 15).map((q: any) => ({
        id: q.id,
        question_text: q.question_text,
        options: q.options,
        correct_answer: '', // Remove correct answer from client
        explanation: undefined, // Remove explanation from client
        topic_id: q.topic_id,
        difficulty: q.difficulty || 'intermediate'
      }));
      
      console.log('✅ Generated and loaded', quizQuestions.length, 'questions');
      setQuestions(quizQuestions);
      setUserAnswers(new Array(quizQuestions.length).fill(null));
      
    } catch (err) {
      console.error('❌ Error loading questions:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load questions';
      setError(errorMessage);
      toast({
        title: "Error loading quiz",
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

  // Handle answer selection
  const handleAnswerSelect = useCallback((answer: string) => {
    setSelectedAnswer(answer);
    
    // Update user answers array
    setUserAnswers(prev => {
      const updated = [...prev];
      updated[currentQuestionIndex] = answer;
      return updated;
    });
  }, [currentQuestionIndex]);

  // Validate answer using secure function
  const validateAnswer = useCallback(async (questionId: string, userAnswer: string) => {
    try {
      const { data, error } = await supabase
        .rpc('validate_quiz_answer', {
          p_question_id: questionId,
          p_user_answer: userAnswer
        });

      if (error) {
        console.error('Error validating answer:', error);
        return { is_correct: false, correct_answer: '', explanation: '' };
      }

      // Type guard for the response data
      const result = data as { is_correct: boolean; correct_answer: string; explanation: string };
      return result || { is_correct: false, correct_answer: '', explanation: '' };
    } catch (err) {
      console.error('Error in answer validation:', err);
      return { is_correct: false, correct_answer: '', explanation: '' };
    }
  }, []);

  // Go to next question
  const goToNextQuestion = useCallback(async () => {
    if (!selectedAnswer || !questions[currentQuestionIndex]) return;

    const currentQuestion = questions[currentQuestionIndex];
    
    // Validate answer using secure function
    const validationResult = await validateAnswer(currentQuestion.id, selectedAnswer);
    const isCorrect = validationResult.is_correct;
    
    // Add to question details with correct answer from server
    const questionDetail: QuizAnswerDetail = {
      questionId: currentQuestion.id,
      userAnswer: selectedAnswer,
      correctAnswer: validationResult.correct_answer,
      isCorrect
    };
    
    setQuestionDetails(prev => [...prev, questionDetail]);
    
    if (isCorrect) {
      setCorrectAnswersCount(prev => prev + 1);
    }

    // Move to next question or complete quiz
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
    } else {
      completeQuiz();
    }
  }, [selectedAnswer, questions, currentQuestionIndex, validateAnswer]);

  // Complete quiz
  const completeQuiz = useCallback(async () => {
    if (!currentSession || !user) return;

    try {
      setIsLoading(true);
      
      const totalElapsed = Date.now() - startTime;
      
      // Handle final question validation if needed
      let finalQuestionDetails = [...questionDetails];
      let finalCorrectCount = correctAnswersCount;
      
      if (selectedAnswer && questions[currentQuestionIndex]) {
        const currentQuestion = questions[currentQuestionIndex];
        const validationResult = await validateAnswer(currentQuestion.id, selectedAnswer);
        const isCorrect = validationResult.is_correct;
        
        if (isCorrect) {
          finalCorrectCount += 1;
        }
        
        finalQuestionDetails.push({
          questionId: currentQuestion.id,
          userAnswer: selectedAnswer,
          correctAnswer: validationResult.correct_answer,
          isCorrect
        });
      }
      
      const scorePercentage = Math.round((finalCorrectCount / questions.length) * 100);

      // Update quiz session
      const { error: updateError } = await supabase
        .from('quiz_sessions')
        .update({
          completed_at: new Date().toISOString(),
          correct_answers: finalCorrectCount,
          score_percentage: scorePercentage,
          time_spent_ms: totalElapsed,
          question_details: JSON.stringify(finalQuestionDetails)
        })
        .eq('id', currentSession.id);

      if (updateError) {
        console.error('Error updating quiz session:', updateError);
        throw new Error('Failed to save quiz results');
      }

      // Also insert into quiz_results for backward compatibility
      const { error: resultsError } = await supabase
        .from('quiz_results')
        .insert({
          user_id: user.id,
          topic: topicId || 'unknown',
          score: finalCorrectCount,
          completion_time: totalElapsed,
          question_details: JSON.stringify(finalQuestionDetails)
        });

      if (resultsError) {
        console.error('Error saving quiz results:', resultsError);
      }

      // Update performance tables
      const { error: perfError } = await supabase
        .rpc('update_user_performance', {
          p_user_id: user.id,
          p_topic: topicId || 'unknown',
          p_score: scorePercentage,
          p_completion_time: totalElapsed
        });

      if (perfError) {
        console.error('Error updating performance:', perfError);
      }

      setQuizCompleted(true);
      setCorrectAnswersCount(finalCorrectCount);
      
      console.log('✅ Quiz completed:', {
        score: finalCorrectCount,
        total: questions.length,
        percentage: scorePercentage
      });

      toast({
        title: "Quiz completed!",
        description: `You scored ${finalCorrectCount}/${questions.length} (${scorePercentage}%)`,
        variant: "default",
      });

    } catch (err) {
      console.error('❌ Error completing quiz:', err);
      toast({
        title: "Error saving results",
        description: err instanceof Error ? err.message : 'Failed to save quiz results',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentSession, user, startTime, correctAnswersCount, selectedAnswer, questions, currentQuestionIndex, questionDetails, topicId, validateAnswer]);

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
    startQuiz,
    handleAnswerSelect,
    goToNextQuestion,
    resetQuiz,
    
    // Utilities
    formatTime,
    
    // Computed
    isAnswered: selectedAnswer !== null,
    scorePercentage: questions.length > 0 ? Math.round((correctAnswersCount / questions.length) * 100) : 0
  };
};
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

  // Load questions from database
  const loadQuestions = useCallback(async (topicId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('🔍 Loading questions for topic:', topicId);
      
      // Get questions from database
      const { data: dbQuestions, error: dbError } = await supabase
        .from('questions')
        .select('*')
        .eq('topic_id', topicId)
        .limit(8);

      if (dbError) {
        console.error('Database error:', dbError);
        throw new Error('Failed to load questions from database');
      }

      if (!dbQuestions || dbQuestions.length === 0) {
        throw new Error('No questions found for this topic');
      }

      // Transform database questions to our format
      const transformedQuestions: SimpleQuestion[] = dbQuestions.map(q => ({
        id: q.id,
        question_text: q.question_text,
        options: Array.isArray(q.options) ? q.options : JSON.parse(q.options as string),
        correct_answer: q.correct_answer,
        explanation: q.explanation,
        topic_id: q.topic_id,
        difficulty: q.difficulty as 'beginner' | 'intermediate' | 'advanced'
      }));

      // Shuffle questions for variety
      const shuffledQuestions = transformedQuestions.sort(() => Math.random() - 0.5);
      
      console.log('✅ Loaded questions:', shuffledQuestions.length);
      setQuestions(shuffledQuestions);
      
      // Initialize user answers array
      setUserAnswers(new Array(shuffledQuestions.length).fill(null));
      
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

  // Check if answer is correct
  const isAnswerCorrect = useCallback((userAnswer: string, correctAnswer: string): boolean => {
    return userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
  }, []);

  // Go to next question
  const goToNextQuestion = useCallback(() => {
    if (!selectedAnswer || !questions[currentQuestionIndex]) return;

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = isAnswerCorrect(selectedAnswer, currentQuestion.correct_answer);
    
    // Add to question details
    const questionDetail: QuizAnswerDetail = {
      questionId: currentQuestion.id,
      userAnswer: selectedAnswer,
      correctAnswer: currentQuestion.correct_answer,
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
  }, [selectedAnswer, questions, currentQuestionIndex, isAnswerCorrect]);

  // Complete quiz
  const completeQuiz = useCallback(async () => {
    if (!currentSession || !user) return;

    try {
      setIsLoading(true);
      
      const totalElapsed = Date.now() - startTime;
      const finalCorrectCount = correctAnswersCount + (selectedAnswer && isAnswerCorrect(selectedAnswer, questions[currentQuestionIndex]?.correct_answer) ? 1 : 0);
      const scorePercentage = Math.round((finalCorrectCount / questions.length) * 100);
      
      // Include final question if needed
      let finalQuestionDetails = [...questionDetails];
      if (selectedAnswer && questions[currentQuestionIndex]) {
        const currentQuestion = questions[currentQuestionIndex];
        const isCorrect = isAnswerCorrect(selectedAnswer, currentQuestion.correct_answer);
        finalQuestionDetails.push({
          questionId: currentQuestion.id,
          userAnswer: selectedAnswer,
          correctAnswer: currentQuestion.correct_answer,
          isCorrect
        });
      }

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
  }, [currentSession, user, startTime, correctAnswersCount, selectedAnswer, questions, currentQuestionIndex, questionDetails, topicId, isAnswerCorrect]);

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
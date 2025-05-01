
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { getQuestionsByTopicId } from "@/services/questionService";
import { getTopicById } from "@/services/topicService";
import { updateUserPerformance } from "@/services/supabasePerformanceService";

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
}

interface Topic {
  id: string;
  title: string;
  description?: string;
}

export function useQuiz(topicId: string | undefined) {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Quiz state
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentTopic, setCurrentTopic] = useState<Topic | null>(null);

  // Fetch questions using react-query
  const { 
    isLoading: isQuestionsLoading, 
    error: questionsError 
  } = useQuery({
    queryKey: ['questions', topicId],
    queryFn: () => getQuestionsByTopicId(topicId),
    enabled: !!topicId,
    meta: {
      onSuccess: (data: Question[]) => {
        setQuestions(data);
      },
      onError: (error: any) => {
        toast({
          title: "Error fetching questions",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  });

  // Fetch topic details
  const { 
    isLoading: isTopicLoading, 
    error: topicError 
  } = useQuery({
    queryKey: ['topic', topicId],
    queryFn: () => getTopicById(topicId),
    enabled: !!topicId,
    meta: {
      onSuccess: (data: any) => {
        setCurrentTopic(data);
      },
      onError: (error: any) => {
        toast({
          title: "Error fetching topic",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  });

  // Fetch data manually in useEffect as a fallback if react-query's onSuccess doesn't work
  useEffect(() => {
    if (isQuestionsLoading === false && !questionsError && questions.length === 0 && topicId) {
      getQuestionsByTopicId(topicId)
        .then(data => {
          setQuestions(data);
        })
        .catch(error => {
          console.error('Error fetching questions:', error);
        });
    }
  }, [isQuestionsLoading, questionsError, topicId, questions.length]);

  useEffect(() => {
    if (isTopicLoading === false && !topicError && !currentTopic && topicId) {
      getTopicById(topicId)
        .then(data => {
          setCurrentTopic(data);
        })
        .catch(error => {
          console.error('Error fetching topic:', error);
        });
    }
  }, [isTopicLoading, topicError, topicId, currentTopic]);

  // Start the timer when questions are loaded
  useEffect(() => {
    if (questions.length > 0) {
      setStartTime(Date.now());
    }
  }, [questions.length]);

  // Update elapsed time
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (startTime > 0 && !quizCompleted) {
      intervalId = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [startTime, quizCompleted]);

  // Format time in minutes:seconds
  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Handle answer selection
  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  // Go to next question or complete quiz
  const goToNextQuestion = () => {
    if (!selectedAnswer) {
      toast({
        title: "Please select an answer",
        description: "You must select an answer before proceeding.",
        variant: "destructive",
      });
      return;
    }

    const currentQuestion = questions[currentQuestionIndex];
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setCorrectAnswers(correctAnswers + 1);
    }

    setSelectedAnswer(null); // Reset selected answer

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  // Restart the quiz
  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setCorrectAnswers(0);
    setQuizCompleted(false);
    setStartTime(Date.now());
    setElapsedTime(0);
  };

  // Submit quiz and save results
  const handleSubmitQuiz = async () => {
    try {
      if (user) {
        const quizTopic = currentTopic?.title || 'General';
        const quizScore = Math.round((correctAnswers / questions.length) * 100);
        const completionTime = Math.floor((Date.now() - startTime) / 1000); // in seconds
        
        // Update the user's performance in Supabase
        await updateUserPerformance(user.id, quizTopic, quizScore, completionTime);
      }
      
      toast({
        title: "Quiz Submitted",
        description: "Your quiz has been submitted and your score has been recorded.",
        variant: "default",
      });
      navigate('/dashboard');
    } catch (error: any) {
      console.error("Error submitting quiz:", error);
      toast({
        title: "Error submitting quiz",
        description: error.message || "Failed to submit the quiz. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    // State
    questions,
    currentQuestionIndex,
    selectedAnswer,
    correctAnswers,
    quizCompleted,
    elapsedTime,
    currentTopic,
    isLoading: isQuestionsLoading || isTopicLoading,
    error: questionsError || topicError,
    
    // Current question
    currentQuestion: questions[currentQuestionIndex],
    
    // Actions
    handleAnswerSelect,
    goToNextQuestion,
    handleRestartQuiz,
    handleSubmitQuiz,
    
    // Utilities
    formatTime,
  };
}

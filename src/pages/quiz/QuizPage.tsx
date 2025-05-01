
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getQuestionsByTopicId } from "@/services/questionService";
import { getTopicById } from "@/services/topicService";
import { updateUserPerformance } from "@/services/supabasePerformanceService";
import QuizQuestion from './components/QuizQuestion';
import QuizResults from './components/QuizResults';
import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
}

const QuizPage = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentTopic, setCurrentTopic] = useState<any | null>(null);

  // Fetch questions using react-query
  const { isLoading: isQuestionsLoading, error: questionsError } = useQuery({
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
  const { isLoading: isTopicLoading, error: topicError } = useQuery({
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

  // Add effect hooks to manage question data and timers
  useEffect(() => {
    // When questions are loaded from the query, set them to state
    if (isQuestionsLoading === false && !questionsError && questions.length === 0) {
      getQuestionsByTopicId(topicId).then(data => {
        setQuestions(data);
      }).catch(error => {
        console.error('Error fetching questions:', error);
      });
    }
  }, [isQuestionsLoading, questionsError, topicId, questions.length]);

  useEffect(() => {
    // When topic is loaded from the query, set it to state
    if (isTopicLoading === false && !topicError && !currentTopic) {
      getTopicById(topicId).then(data => {
        setCurrentTopic(data);
      }).catch(error => {
        console.error('Error fetching topic:', error);
      });
    }
  }, [isTopicLoading, topicError, topicId, currentTopic]);

  useEffect(() => {
    if (questions.length > 0) {
      setStartTime(Date.now());
    }
  }, [questions.length]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (startTime > 0 && !quizCompleted) {
      intervalId = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [startTime, quizCompleted]);

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

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

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setCorrectAnswers(0);
    setQuizCompleted(false);
    setStartTime(Date.now());
    setElapsedTime(0);
  };

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

  if (isQuestionsLoading || isTopicLoading) {
    return <LoadingState />;
  }

  if (questionsError || topicError) {
    return <ErrorState 
      errorMessage={(questionsError?.message || topicError?.message || "Failed to load quiz.")}
      onRetry={() => navigate('/topics')}
    />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-darkBlue-900 via-darkBlue-800 to-darkBlue-700">
      <Navbar />
      <main className="flex-grow p-4">
        {quizCompleted ? (
          <QuizResults 
            correctAnswers={correctAnswers}
            totalQuestions={questions.length}
            elapsedTime={elapsedTime}
            topicTitle={currentTopic?.title}
            formatTime={formatTime}
            onRestart={handleRestartQuiz}
            onSubmit={handleSubmitQuiz}
          />
        ) : (
          <QuizQuestion 
            currentQuestion={questions[currentQuestionIndex]}
            currentIndex={currentQuestionIndex}
            totalQuestions={questions.length}
            selectedAnswer={selectedAnswer}
            onAnswerSelect={handleAnswerSelect}
            onNextQuestion={goToNextQuestion}
            elapsedTime={elapsedTime}
            formatTime={formatTime}
            topicTitle={currentTopic?.title}
          />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default QuizPage;

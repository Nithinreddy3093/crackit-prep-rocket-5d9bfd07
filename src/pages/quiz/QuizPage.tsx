
import React, { useCallback, useMemo, Suspense, lazy, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuiz } from "@/hooks/useQuiz";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';
import QuizIntro from '@/components/quiz/QuizIntro';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";

// Lazy load components for better initial loading performance
const QuizQuestion = lazy(() => import('./components/QuizQuestion'));
const QuizResults = lazy(() => import('./components/QuizResults'));

const QuizPage = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const quiz = useQuiz(topicId);
  
  // Handle initial loading state
  useEffect(() => {
    if (!quiz.isLoading && isInitialLoad) {
      setIsInitialLoad(false);
    }
  }, [quiz.isLoading, isInitialLoad]);
  
  useEffect(() => {
    // Show error toast when quiz fails to load
    if (quiz.error && !isInitialLoad) {
      toast({
        title: "Error loading quiz",
        description: (quiz.error as Error).message || "Failed to load quiz",
        variant: "destructive",
      });
    }
  }, [quiz.error, isInitialLoad]);

  const handleBackToTopics = useCallback(() => {
    navigate('/topics');
  }, [navigate]);
  
  // Memoize content to prevent unnecessary re-renders
  const renderContent = useMemo(() => {
    // Early return for initial loading state to prevent flickering
    if (isInitialLoad || (quiz.isLoading && quiz.questions.length === 0)) {
      return <LoadingState />;
    }
    
    if (quiz.error) {
      return (
        <ErrorState 
          errorMessage={(quiz.error as Error).message || "Failed to load quiz."}
          onRetry={() => window.location.href = '/topics'}
        />
      );
    }
    
    if (!quiz.quizStarted) {
      return (
        <QuizIntro 
          topic={quiz.currentTopic?.title || "General Knowledge"}
          questionCount={quiz.questions.length}
          onStartQuiz={quiz.startQuiz}
          isLoading={quiz.isLoading}
          seenQuestions={quiz.seenQuestionIds.length}
        />
      );
    }
    
    if (quiz.quizCompleted) {
      return (
        <Suspense fallback={<LoadingState />}>
          <QuizResults 
            correctAnswers={quiz.correctAnswers}
            totalQuestions={quiz.questions.length}
            elapsedTime={quiz.elapsedTime}
            topicTitle={quiz.currentTopic?.title}
            formatTime={quiz.formatTime}
            onRestart={quiz.handleRestartQuiz}
            onSubmit={quiz.handleSubmitQuiz}
            questionDetails={quiz.questionDetails}
          />
        </Suspense>
      );
    }
    
    return (
      <Suspense fallback={<LoadingState />}>
        <QuizQuestion 
          currentQuestion={quiz.currentQuestion}
          currentIndex={quiz.currentQuestionIndex}
          totalQuestions={quiz.questions.length}
          selectedAnswer={quiz.selectedAnswer}
          onAnswerSelect={quiz.handleAnswerSelect}
          onNextQuestion={quiz.goToNextQuestion}
          elapsedTime={quiz.elapsedTime}
          formatTime={quiz.formatTime}
          topicTitle={quiz.currentTopic?.title}
        />
      </Suspense>
    );
  }, [
    isInitialLoad,
    quiz.isLoading,
    quiz.error,
    quiz.quizStarted,
    quiz.quizCompleted,
    quiz.currentTopic,
    quiz.questions.length,
    quiz.startQuiz,
    quiz.seenQuestionIds.length,
    quiz.correctAnswers,
    quiz.elapsedTime,
    quiz.formatTime,
    quiz.handleRestartQuiz,
    quiz.handleSubmitQuiz,
    quiz.questionDetails,
    quiz.currentQuestion,
    quiz.currentQuestionIndex,
    quiz.selectedAnswer,
    quiz.handleAnswerSelect,
    quiz.goToNextQuestion
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-darkBlue-900 via-darkBlue-800 to-darkBlue-700">
      <Navbar />
      <main className="flex-grow p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <Button 
            variant="ghost" 
            className="mb-6 hover:bg-white/10 text-white"
            onClick={handleBackToTopics}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Topics
          </Button>
          
          {renderContent}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default QuizPage;

import React, { useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSimpleQuiz } from "@/hooks/useSimpleQuiz";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';
import SimpleQuizIntro from '@/components/quiz/SimpleQuizIntro';
import SimpleQuizQuestion from '@/components/quiz/SimpleQuizQuestion';
import SimpleQuizResults from '@/components/quiz/SimpleQuizResults';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const QuizPage = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const quiz = useSimpleQuiz(topicId);

  const handleBackToTopics = useCallback(() => {
    navigate('/topics');
  }, [navigate]);
  
  // Memoize content to prevent unnecessary re-renders
  const renderContent = useMemo(() => {
    if (quiz.isLoading && quiz.questions.length === 0) {
      return <LoadingState />;
    }
    
    if (quiz.error) {
      return (
        <ErrorState 
          errorMessage={quiz.error}
          onRetry={() => window.location.href = '/topics'}
        />
      );
    }
    
    if (!quiz.quizStarted) {
      return (
        <SimpleQuizIntro 
          topic={topicId || "General Knowledge"}
          questionCount={quiz.totalQuestions}
          onStartQuiz={quiz.startQuiz}
          isLoading={quiz.isLoading}
        />
      );
    }
    
    if (quiz.quizCompleted) {
      return (
        <SimpleQuizResults 
          correctAnswersCount={quiz.correctAnswersCount}
          totalQuestions={quiz.totalQuestions}
          scorePercentage={quiz.scorePercentage}
          elapsedTime={quiz.elapsedTime}
          formatTime={quiz.formatTime}
          topicTitle={topicId}
          questionDetails={quiz.questionDetails}
          onRestart={quiz.resetQuiz}
        />
      );
    }
    
    if (!quiz.currentQuestion) {
      return <LoadingState />;
    }
    
    return (
      <SimpleQuizQuestion 
        question={quiz.currentQuestion}
        currentIndex={quiz.currentQuestionIndex}
        totalQuestions={quiz.totalQuestions}
        selectedAnswer={quiz.selectedAnswer}
        onAnswerSelect={quiz.handleAnswerSelect}
        onNextQuestion={quiz.goToNextQuestion}
        elapsedTime={quiz.elapsedTime}
        formatTime={quiz.formatTime}
        topicTitle={topicId}
        isValidating={quiz.isValidating}
        validationResult={quiz.validationResult}
      />
    );
  }, [
    quiz.isLoading,
    quiz.error,
    quiz.quizStarted,
    quiz.quizCompleted,
    quiz.questions.length,
    quiz.totalQuestions,
    quiz.startQuiz,
    quiz.correctAnswersCount,
    quiz.scorePercentage,
    quiz.elapsedTime,
    quiz.formatTime,
    quiz.questionDetails,
    quiz.resetQuiz,
    quiz.currentQuestion,
    quiz.currentQuestionIndex,
    quiz.selectedAnswer,
    quiz.handleAnswerSelect,
    quiz.goToNextQuestion,
    quiz.isValidating,
    quiz.validationResult,
    topicId
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
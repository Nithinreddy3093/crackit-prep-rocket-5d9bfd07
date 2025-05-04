
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuiz } from "@/hooks/useQuiz";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import QuizQuestion from './components/QuizQuestion';
import QuizResults from './components/QuizResults';
import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';
import QuizIntro from '@/components/quiz/QuizIntro';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const QuizPage = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const quiz = useQuiz(topicId);
  
  const handleBackToTopics = () => {
    navigate('/topics');
  };
  
  if (quiz.isLoading) {
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
          
          {!quiz.quizStarted ? (
            <QuizIntro 
              topic={quiz.currentTopic?.title || "General Knowledge"}
              questionCount={quiz.questions.length}
              onStartQuiz={quiz.startQuiz}
              isLoading={quiz.isLoading}
              seenQuestions={quiz.seenQuestionIds.length}
            />
          ) : quiz.quizCompleted ? (
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
          ) : (
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
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default QuizPage;


import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuiz } from "@/hooks/useQuiz";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import QuizQuestion from './components/QuizQuestion';
import QuizResults from './components/QuizResults';
import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';
import QuizIntro from '@/components/quiz/QuizIntro';

const QuizPage = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const [quizStarted, setQuizStarted] = useState(false);
  const quiz = useQuiz(topicId);
  
  const handleStartQuiz = () => {
    setQuizStarted(true);
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
        {!quizStarted ? (
          <QuizIntro 
            topic={quiz.currentTopic?.title || "General Knowledge"}
            questionCount={quiz.questions.length}
            onStartQuiz={handleStartQuiz}
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
      </main>
      <Footer />
    </div>
  );
};

export default QuizPage;

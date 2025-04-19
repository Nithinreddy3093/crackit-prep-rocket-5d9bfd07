
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import QuizIntro from '@/components/quiz/QuizIntro';
import QuizCard from '@/components/QuizCard';
import QuizFeedback from '@/components/QuizFeedback';
import { generateQuestions } from '@/services/quizService';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const Quiz = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [correctQuestions, setCorrectQuestions] = useState<number[]>([]);
  const [incorrectQuestions, setIncorrectQuestions] = useState<number[]>([]);
  const [topic, setTopic] = useState(topicId || 'General Computer Science');

  useEffect(() => {
    const loadQuestions = async () => {
      setIsLoading(true);
      try {
        const quizQuestions = await generateQuestions(topic);
        setQuestions(quizQuestions);
      } catch (error) {
        console.error('Failed to load questions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadQuestions();
  }, [topic]);

  const handleStartQuiz = () => {
    setShowIntro(false);
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prev) => prev + 1);
  };

  const handleQuizCompleted = (correct: number[], incorrect: number[]) => {
    setCorrectQuestions(correct);
    setIncorrectQuestions(incorrect);
    setScore(correct.length);
    setQuizCompleted(true);
  };

  const handleRetakeQuiz = () => {
    setCurrentQuestionIndex(0);
    setQuizCompleted(false);
    setScore(0);
    setCorrectQuestions([]);
    setIncorrectQuestions([]);
    setShowIntro(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent animate-pulse-slow flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 md:py-16">
        {showIntro ? (
          <QuizIntro 
            topic={topic} 
            questionCount={questions.length} 
            onStartQuiz={handleStartQuiz} 
          />
        ) : quizCompleted ? (
          <QuizFeedback
            score={score}
            totalQuestions={questions.length}
            correctQuestions={correctQuestions}
            incorrectQuestions={incorrectQuestions}
            topic={topic}
          />
        ) : (
          <div className="max-w-3xl mx-auto">
            <QuizCard
              question={questions[currentQuestionIndex].question}
              options={questions[currentQuestionIndex].options}
              correctAnswer={questions[currentQuestionIndex].correctAnswer}
              explanation={questions[currentQuestionIndex].explanation}
              onNextQuestion={handleNextQuestion}
              onCompleted={handleQuizCompleted}
              isLastQuestion={currentQuestionIndex === questions.length - 1}
              currentQuestion={currentQuestionIndex + 1}
              totalQuestions={questions.length}
              correctQuestions={correctQuestions}
              incorrectQuestions={incorrectQuestions}
            />
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Quiz;

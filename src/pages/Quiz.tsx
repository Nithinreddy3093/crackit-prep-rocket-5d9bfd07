
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import QuizIntro from '@/components/quiz/QuizIntro';
import QuizCard from '@/components/QuizCard';
import QuizFeedback from '@/components/QuizFeedback';
import { generateQuestions } from '@/services/quizService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from "@/components/ui/use-toast";

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
  const { user, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isRetrying, setIsRetrying] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [correctQuestions, setCorrectQuestions] = useState<number[]>([]);
  const [incorrectQuestions, setIncorrectQuestions] = useState<number[]>([]);
  const [topic, setTopic] = useState(topicId || 'General Computer Science');
  const [quizStartTime, setQuizStartTime] = useState<Date | null>(null);
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');

  useEffect(() => {
    const loadQuestions = async () => {
      setIsLoading(true);
      try {
        let retries = 0;
        let quizQuestions: Question[] = [];
        
        while (retries < 3 && quizQuestions.length === 0) {
          if (retries > 0) {
            setIsRetrying(true);
            // Add a slight delay between retries
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
          
          quizQuestions = await generateQuestions(topic, difficulty);
          retries++;
        }
        
        if (quizQuestions.length > 0) {
          setQuestions(quizQuestions);
        } else {
          throw new Error("Failed to load questions after multiple attempts");
        }
      } catch (error) {
        console.error('Failed to load questions:', error);
        toast({
          title: "Error loading questions",
          description: "There was a problem loading quiz questions. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
        setIsRetrying(false);
      }
    };

    loadQuestions();
  }, [topic, difficulty]);

  const handleStartQuiz = () => {
    setShowIntro(false);
    setQuizStartTime(new Date());
    
    // Track quiz start if user is authenticated
    if (isAuthenticated) {
      console.log(`User ${user?.id} started ${topic} quiz at ${difficulty} difficulty`);
    }
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prev) => prev + 1);
  };

  const handleQuizCompleted = (correct: number[], incorrect: number[]) => {
    const quizEndTime = new Date();
    const quizDurationMs = quizStartTime ? quizEndTime.getTime() - quizStartTime.getTime() : 0;
    const quizDurationMin = Math.round(quizDurationMs / 60000);
    
    setCorrectQuestions(correct);
    setIncorrectQuestions(incorrect);
    setScore(correct.length);
    setQuizCompleted(true);
    
    // Track quiz completion if user is authenticated
    if (isAuthenticated) {
      console.log(`User ${user?.id} completed ${topic} quiz with score ${correct.length}/${questions.length} in ${quizDurationMin} minutes`);
    }
  };

  const handleRetakeQuiz = () => {
    setCurrentQuestionIndex(0);
    setQuizCompleted(false);
    setScore(0);
    setCorrectQuestions([]);
    setIncorrectQuestions([]);
    setShowIntro(true);
  };

  const handleDifficultyChange = (newDifficulty: 'beginner' | 'intermediate' | 'advanced') => {
    setDifficulty(newDifficulty);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 md:py-16">
        {showIntro ? (
          <QuizIntro 
            topic={topic} 
            questionCount={questions.length} 
            onStartQuiz={handleStartQuiz} 
            isLoading={isLoading || isRetrying}
          />
        ) : quizCompleted ? (
          <QuizFeedback
            score={score}
            totalQuestions={questions.length}
            correctQuestions={correctQuestions}
            incorrectQuestions={incorrectQuestions}
            topic={topic}
            difficulty={difficulty}
          />
        ) : (
          <div className="max-w-3xl mx-auto">
            {isLoading || isRetrying ? (
              <div className="bg-card rounded-xl shadow-sm p-8 text-center">
                <div className="flex flex-col items-center justify-center">
                  <div className="mb-4 relative">
                    <div className="h-16 w-16 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-8 w-8 rounded-full bg-primary/20"></div>
                    </div>
                  </div>
                  <h3 className="text-xl font-medium text-foreground mb-2">Hang tight!</h3>
                  <p className="text-muted-foreground">Prepping your next challenge...</p>
                </div>
              </div>
            ) : (
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
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Quiz;


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
import { Loader2, AlertTriangle } from 'lucide-react';

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
  const [retryCount, setRetryCount] = useState(0);
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
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (topicId) {
      setTopic(decodeURIComponent(topicId));
    }
  }, [topicId]);

  useEffect(() => {
    const loadQuestions = async () => {
      setIsLoading(true);
      setLoadError(null);
      try {
        let retries = 0;
        let quizQuestions: Question[] = [];
        
        while (retries < 3 && quizQuestions.length === 0) {
          if (retries > 0) {
            setIsRetrying(true);
            setRetryCount(retries);
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
        setLoadError("We couldn't load questions at this time. Please try again later.");
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

    if (!showIntro || questions.length === 0) {
      loadQuestions();
    }
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
    setLoadError(null);
  };

  const handleDifficultyChange = (newDifficulty: 'beginner' | 'intermediate' | 'advanced') => {
    setDifficulty(newDifficulty);
  };

  const getLoadingMessage = () => {
    if (isRetrying) {
      return `Hang tight! Attempt ${retryCount}/3 to prepare your questions...`;
    }
    return "Prepping your next challenge...";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 md:py-16">
        {showIntro ? (
          <QuizIntro 
            topic={topic} 
            questionCount={10} // We're now always using 10 questions
            onStartQuiz={handleStartQuiz} 
            isLoading={isLoading || isRetrying}
            onDifficultyChange={handleDifficultyChange}
            selectedDifficulty={difficulty}
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
                  <p className="text-muted-foreground">{getLoadingMessage()}</p>
                </div>
              </div>
            ) : loadError ? (
              <div className="bg-card rounded-xl shadow-sm p-8 text-center">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <AlertTriangle className="h-16 w-16 text-amber-500" />
                  <h3 className="text-xl font-medium text-foreground">We encountered a problem</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">{loadError}</p>
                  <div className="flex gap-4 mt-6">
                    <button 
                      onClick={() => navigate('/topics')}
                      className="px-4 py-2 rounded-md bg-background border border-input hover:bg-accent text-foreground"
                    >
                      Choose Another Topic
                    </button>
                    <button 
                      onClick={handleRetakeQuiz}
                      className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              </div>
            ) : questions.length > 0 ? (
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
            ) : (
              <div className="bg-card rounded-xl shadow-sm p-8 text-center">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <AlertTriangle className="h-16 w-16 text-amber-500" />
                  <h3 className="text-xl font-medium text-foreground">No questions available</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">We couldn't find any questions for this topic. Please try a different topic.</p>
                  <button 
                    onClick={() => navigate('/topics')}
                    className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Browse Topics
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Quiz;

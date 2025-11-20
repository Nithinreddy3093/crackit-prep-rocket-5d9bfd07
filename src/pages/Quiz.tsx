import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SimpleQuizIntro from '@/components/quiz/SimpleQuizIntro';
import SimpleQuizQuestion from '@/components/quiz/SimpleQuizQuestion';
import SimpleQuizResults from '@/components/quiz/SimpleQuizResults';
import QuizModeSelector from '@/components/quiz/QuizModeSelector';
import ExplanationModal from '@/components/quiz/ExplanationModal';
import { useSimpleQuiz } from '@/hooks/useSimpleQuiz';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useQuizProgress } from '@/hooks/useQuizProgress';
import { useAdaptiveDifficulty } from '@/hooks/useAdaptiveDifficulty';
import { Button } from '@/components/ui/button';
import { Pause, Play } from 'lucide-react';

const Quiz = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const queryParams = new URLSearchParams(location.search);
  const topicParam = queryParams.get('topic') || 'React';
  
  const [quizMode, setQuizMode] = useState<'practice' | 'exam' | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [currentExplanation, setCurrentExplanation] = useState({
    isCorrect: false,
    explanation: '',
    correctAnswer: '',
    userAnswer: '',
  });

  const { loadProgress, saveProgress, clearProgress } = useQuizProgress(topicParam);
  const { currentDifficulty, trackAnswer } = useAdaptiveDifficulty('beginner');

  const {
    questions,
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    selectedAnswer,
    questionDetails,
    correctAnswersCount,
    quizStarted,
    quizCompleted,
    isLoading,
    elapsedTime,
    formatTime,
    scorePercentage,
    isValidating,
    validationResult,
    handleAnswerSelect,
    goToNextQuestion,
    startQuiz,
    completeQuiz,
    resetQuiz,
  } = useSimpleQuiz(topicParam);

  useEffect(() => {
    if (!quizStarted && !quizCompleted) {
      const saved = loadProgress();
      if (saved && saved.topicId === topicParam) {
        toast({
          title: 'Resume Quiz?',
          description: 'You have a quiz in progress. Would you like to continue?',
        });
      }
    }
  }, []);

  useEffect(() => {
    if (quizStarted && !quizCompleted && quizMode) {
      saveProgress({
        topicId: topicParam,
        currentQuestionIndex,
        answers: {},
        startTime: Date.now(),
        mode: quizMode,
      });
    }
  }, [currentQuestionIndex, quizStarted, quizCompleted, quizMode]);

  const handleModeSelect = (mode: 'practice' | 'exam') => {
    setQuizMode(mode);
    startQuiz();
  };

  const handleAnswerSelectWithMode = (answer: string) => {
    handleAnswerSelect(answer);
    
    if (quizMode === 'practice' && currentQuestion) {
      const isCorrect = answer === currentQuestion.correct_answer;
      trackAnswer(isCorrect);
      
      setCurrentExplanation({
        isCorrect,
        explanation: currentQuestion.explanation || 'No explanation available.',
        correctAnswer: currentQuestion.correct_answer,
        userAnswer: answer,
      });
      setShowExplanation(true);
    }
  };

  const handleContinue = () => {
    setShowExplanation(false);
    goToNextQuestion();
  };

  const handlePauseToggle = () => {
    if (quizMode === 'practice') {
      setIsPaused(!isPaused);
      toast({
        title: isPaused ? 'Quiz Resumed' : 'Quiz Paused',
        description: isPaused ? 'Continue learning!' : 'Take a break, come back anytime.',
      });
    }
  };

  const handleFinish = () => {
    clearProgress();
    completeQuiz();
  };

  const handleRestart = () => {
    clearProgress();
    resetQuiz();
    setQuizMode(null);
    setIsPaused(false);
    setShowExplanation(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-darkBlue-900 via-darkBlue-800 to-darkBlue-700">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Please log in to take quizzes</h2>
            <Button onClick={() => navigate('/login')}>Log In</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!quizMode) {
    return (
      <>
        <Navbar />
        <QuizModeSelector onSelectMode={handleModeSelect} />
        <Footer />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-darkBlue-900 via-darkBlue-800 to-darkBlue-700">
      <Navbar />
      
      <main className="flex-1 py-12 px-4">
        {!quizStarted && !quizCompleted && (
          <SimpleQuizIntro 
            topic={topicParam} 
            questionCount={totalQuestions}
            onStartQuiz={startQuiz}
            isLoading={isLoading}
          />
        )}

        {quizStarted && !quizCompleted && !isPaused && currentQuestion && (
          <div className="max-w-4xl mx-auto">
            <div className="mb-4 flex justify-between items-center">
              <div className="flex gap-2">
                {quizMode === 'practice' && (
                  <Button variant="outline" size="sm" onClick={handlePauseToggle}>
                    <Pause className="h-4 w-4 mr-2" />
                    Pause
                  </Button>
                )}
                <span className="text-sm text-white/70 flex items-center">
                  Difficulty: <span className="ml-1 capitalize font-semibold">{currentDifficulty}</span>
                </span>
              </div>
            </div>

            <SimpleQuizQuestion
              question={currentQuestion}
              currentIndex={currentQuestionIndex}
              totalQuestions={totalQuestions}
              selectedAnswer={selectedAnswer}
              onAnswerSelect={handleAnswerSelectWithMode}
              onNextQuestion={goToNextQuestion}
              elapsedTime={elapsedTime}
              formatTime={formatTime}
              topicTitle={topicParam}
              isValidating={isValidating}
              validationResult={validationResult}
            />

            {quizMode === 'exam' && selectedAnswer && currentQuestionIndex < totalQuestions - 1 && (
              <div className="mt-4 text-center">
                <Button onClick={goToNextQuestion} size="lg">
                  Next Question
                </Button>
              </div>
            )}

            {currentQuestionIndex === totalQuestions - 1 && selectedAnswer && (
              <div className="mt-4 text-center">
                <Button onClick={handleFinish} size="lg">
                  Finish Quiz
                </Button>
              </div>
            )}
          </div>
        )}

        {isPaused && (
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-card p-12 rounded-lg">
              <h2 className="text-3xl font-bold mb-4">Quiz Paused</h2>
              <p className="text-muted-foreground mb-8">
                Take your time. Click resume when you're ready to continue.
              </p>
              <Button onClick={handlePauseToggle} size="lg">
                <Play className="h-5 w-5 mr-2" />
                Resume Quiz
              </Button>
            </div>
          </div>
        )}

        {quizCompleted && (
          <SimpleQuizResults 
            correctAnswersCount={correctAnswersCount}
            totalQuestions={totalQuestions}
            scorePercentage={scorePercentage}
            elapsedTime={elapsedTime}
            formatTime={formatTime}
            topicTitle={topicParam}
            questionDetails={questionDetails}
            onRestart={handleRestart}
          />
        )}
      </main>

      <Footer />

      <ExplanationModal
        isOpen={showExplanation}
        onClose={handleContinue}
        isCorrect={currentExplanation.isCorrect}
        explanation={currentExplanation.explanation}
        correctAnswer={currentExplanation.correctAnswer}
        userAnswer={currentExplanation.userAnswer}
      />
    </div>
  );
};

export default Quiz;

import React, { memo, useCallback, useState, useEffect } from 'react';
import { Question } from '@/services/questionService';
import QuizOption from './QuizOption';
import QuizHeader from './QuizHeader';
import QuizProgress from './QuizProgress';
import QuizActions from './QuizActions';

interface QuizQuestionProps {
  currentQuestion: Question;
  currentIndex: number;
  totalQuestions: number;
  selectedAnswer: number | null;
  onAnswerSelect: (answerIndex: number) => void; 
  onNextQuestion: () => void;
  elapsedTime: number;
  formatTime: (ms: number) => string;
  topicTitle?: string;
}

// Prevent unnecessary re-renders by wrapping the component
const QuizQuestion: React.FC<QuizQuestionProps> = memo(({
  currentQuestion,
  currentIndex,
  totalQuestions,
  selectedAnswer,
  onAnswerSelect,
  onNextQuestion,
  elapsedTime,
  formatTime,
  topicTitle
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  
  useEffect(() => {
    // Mark component as loaded after mount
    setIsLoaded(true);
    
    // Add slight delay to trigger animation
    const timer = setTimeout(() => {
      setAnimateIn(true);
    }, 50);
    
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    // Reset animation state when question changes
    setAnimateIn(false);
    const timer = setTimeout(() => {
      setAnimateIn(true);
    }, 50);
    
    return () => clearTimeout(timer);
  }, [currentQuestion?.id]);
  
  const isAnswered = selectedAnswer !== null;
  // Don't show correct/incorrect during quiz - only track selection
  const isCorrect = null; // Will be calculated only on results page

  const createAnswerSelectHandler = useCallback((index: number) => () => {
    onAnswerSelect(index);
  }, [onAnswerSelect]);

  if (!currentQuestion) {
    return <div className="min-h-[400px] flex items-center justify-center">
      <div className="text-white/60">Loading question...</div>
    </div>;
  }
  
  const animationClass = !isLoaded ? "" : (animateIn ? "animate-fade-in" : "opacity-0");
  
  return (
    <div className={`glass-card p-6 space-y-6 transition-opacity duration-300 ${animationClass}`}>
      {/* Header with topic and timer */}
      <QuizHeader 
        topicTitle={topicTitle}
        elapsedTime={elapsedTime}
        formatTime={formatTime}
      />
      
      {/* Question progress */}
      <QuizProgress 
        currentIndex={currentIndex}
        totalQuestions={totalQuestions}
      />
      
      {/* Question */}
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-white">{currentQuestion.text}</h3>
        {/* Don't show explanation during quiz - only show it after completion */}
      </div>
      
      {/* Answer options */}
      <div className="space-y-3">
        {currentQuestion.options.map((option, index) => (
          <QuizOption
            key={`${currentQuestion.id}-option-${index}`}
            option={option}
            index={index}
            selected={selectedAnswer === index}
            isCorrect={null} // Don't show correct/incorrect during quiz
            isAnswered={false} // Don't show answered state during quiz
            correctAnswer={currentQuestion.correctAnswer}
            onSelect={createAnswerSelectHandler(index)}
          />
        ))}
      </div>
      
      {/* Actions */}
      <QuizActions 
        currentIndex={currentIndex}
        totalQuestions={totalQuestions}
        isAnswered={isAnswered}
        questionId={currentQuestion.id}
        onNextQuestion={onNextQuestion}
      />
    </div>
  );
});

QuizQuestion.displayName = 'QuizQuestion';

export default QuizQuestion;
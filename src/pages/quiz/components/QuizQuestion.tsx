
import React, { memo, useMemo, useCallback } from 'react';
import { Question } from '@/services/questionService';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

// Memoized option component to reduce re-renders
const QuizOption = memo(({ 
  option, 
  index, 
  selected, 
  isCorrect, 
  isAnswered, 
  correctAnswer,
  onSelect 
}: { 
  option: string; 
  index: number; 
  selected: boolean; 
  isCorrect: boolean | null; 
  isAnswered: boolean;
  correctAnswer: string;
  onSelect: () => void;
}) => {
  // Create classes as a memoized value to prevent recalculation
  const classes = useMemo(() => {
    const baseClasses = `p-4 rounded-lg border transition-all`;
    const interactionClasses = !isAnswered ? 'cursor-pointer hover:bg-white/5 hover:border-white/30' : 'cursor-default';
    
    let stateClasses = 'border-white/10 bg-white/5';
    if (selected && isCorrect === true) {
      stateClasses = 'bg-green-500/20 border-green-500/50';
    } else if (selected && isCorrect === false) {
      stateClasses = 'bg-red-500/20 border-red-500/50';
    } else if (!selected && option === correctAnswer && isAnswered) {
      stateClasses = 'bg-green-500/10 border-green-500/30';
    } else if (!selected && isAnswered) {
      stateClasses = 'opacity-50';
    }
    
    return `${baseClasses} ${interactionClasses} ${stateClasses}`;
  }, [selected, isCorrect, isAnswered, option, correctAnswer]);

  const optionLetterClass = useMemo(() => 
    `w-6 h-6 rounded-full mr-3 flex items-center justify-center text-xs ${selected ? 'bg-white/20' : 'bg-darkBlue-800/70'}`,
    [selected]
  );

  return (
    <div onClick={!isAnswered ? onSelect : undefined} className={classes}>
      <div className="flex items-center">
        <div className={optionLetterClass}>
          {String.fromCharCode(65 + index)}
        </div>
        <div className="flex-grow">{option}</div>
        {isAnswered && (
          <div className="ml-2">
            {option === correctAnswer ? 
              <CheckCircle className="h-5 w-5 text-green-400" /> : 
              (selected ? <AlertCircle className="h-5 w-5 text-red-400" /> : null)
            }
          </div>
        )}
      </div>
    </div>
  );
});

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
  const isAnswered = selectedAnswer !== null;
  const isCorrect = useMemo(() => 
    isAnswered && currentQuestion?.options[selectedAnswer] === currentQuestion?.correctAnswer,
    [isAnswered, currentQuestion, selectedAnswer]
  );
  
  // Compute progress once
  const progressPercentage = useMemo(() => 
    Math.floor(((currentIndex) / totalQuestions) * 100), 
    [currentIndex, totalQuestions]
  );

  // Memoize handlers to prevent recreations on each render
  const handleNextQuestion = useCallback(() => {
    onNextQuestion();
  }, [onNextQuestion]);

  const createAnswerSelectHandler = useCallback((index: number) => () => {
    onAnswerSelect(index);
  }, [onAnswerSelect]);

  // Memoize feedback message
  const feedbackMessage = useMemo(() => {
    if (!isAnswered) return null;
    
    const feedbackClass = isCorrect 
      ? 'bg-green-500/10 border border-green-500/30' 
      : 'bg-red-500/10 border border-red-500/30';
    
    return (
      <div className={`p-4 rounded-lg ${feedbackClass}`}>
        <div className="font-semibold mb-2 flex items-center">
          {isCorrect ? 
            <><CheckCircle className="h-4 w-4 mr-2 text-green-400" /> Correct!</> : 
            <><AlertCircle className="h-4 w-4 mr-2 text-red-400" /> Incorrect</>
          }
        </div>
        <p className="text-sm text-white/80">
          {currentQuestion?.explanation || 
            (isCorrect ? 
              "Great job! That's the right answer." : 
              `The correct answer is "${currentQuestion?.correctAnswer}".`
            )
          }
        </p>
      </div>
    );
  }, [isAnswered, isCorrect, currentQuestion]);

  if (!currentQuestion) {
    return null;
  }
  
  return (
    <div className="glass-card p-6 space-y-6 animate-fade-in">
      {/* Header with topic and timer */}
      <div className="flex justify-between items-center">
        <div className="text-white">
          <span className="text-sm font-light">Topic:</span>
          <h3 className="text-lg font-semibold">{topicTitle || 'General Knowledge'}</h3>
        </div>
        <div className="flex items-center space-x-1 text-white/90 bg-darkBlue-800/50 px-3 py-1 rounded-full">
          <Clock className="h-4 w-4" />
          <span className="text-sm font-mono">{formatTime(elapsedTime)}</span>
        </div>
      </div>
      
      {/* Question progress */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-white/80 text-sm">
          <span>Question {currentIndex + 1} of {totalQuestions}</span>
          <span>{progressPercentage}% Complete</span>
        </div>
        <div className="w-full bg-darkBlue-800/50 rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
      
      {/* Question */}
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-white">{currentQuestion.text}</h3>
        {currentQuestion.explanation && (
          <div className="text-white/70 text-sm">{currentQuestion.explanation}</div>
        )}
      </div>
      
      {/* Answer options */}
      <div className="space-y-3">
        {currentQuestion.options.map((option, index) => (
          <QuizOption
            key={index}
            option={option}
            index={index}
            selected={selectedAnswer === index}
            isCorrect={isAnswered ? option === currentQuestion.correctAnswer : null}
            isAnswered={isAnswered}
            correctAnswer={currentQuestion.correctAnswer}
            onSelect={createAnswerSelectHandler(index)}
          />
        ))}
      </div>
      
      {/* Feedback and next button */}
      {feedbackMessage}
      
      <div className="flex justify-between pt-4">
        <div className="text-sm text-white/60">
          ID: {currentQuestion.id}
        </div>
        <Button 
          onClick={handleNextQuestion}
          disabled={!isAnswered}
          className="bg-primary hover:bg-primary/90"
        >
          {currentIndex === totalQuestions - 1 ? 'Finish Quiz' : 'Next Question'}
        </Button>
      </div>
    </div>
  );
});

QuizQuestion.displayName = 'QuizQuestion';

export default QuizQuestion;

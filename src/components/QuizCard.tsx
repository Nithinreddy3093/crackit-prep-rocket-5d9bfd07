
import React, { useState, useCallback, memo } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle } from 'lucide-react';

interface QuizCardProps {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  onNextQuestion: () => void;
  onCompleted: (correctQuestions: number[], incorrectQuestions: number[]) => void;
  isLastQuestion: boolean;
  currentQuestion: number;
  totalQuestions: number;
  correctQuestions: number[];
  incorrectQuestions: number[];
}

// Memoized option button component to prevent unnecessary re-renders
const QuizOptionButton = memo(({ 
  option, 
  index, 
  selected, 
  isAnswered, 
  isCorrect, 
  onClick 
}: { 
  option: string; 
  index: number; 
  selected: boolean; 
  isAnswered: boolean; 
  isCorrect: boolean;
  onClick: () => void; 
}) => {
  const letterIndex = String.fromCharCode(65 + index);
  
  let className = `w-full text-left p-3 rounded-lg border transition-all `;
  if (selected) {
    if (isAnswered) {
      className += isCorrect 
        ? 'bg-green-500/10 border-green-500/30 dark:bg-green-500/5 dark:border-green-500/20 '
        : 'bg-red-500/10 border-red-500/30 dark:bg-red-500/5 dark:border-red-500/20 ';
    } else {
      className += 'bg-primary/10 border-primary/30 dark:bg-primary/5 dark:border-primary/20 ';
    }
  } else if (isAnswered && isCorrect) {
    className += 'bg-green-500/10 border-green-500/30 dark:bg-green-500/5 dark:border-green-500/20 ';
  } else {
    className += 'bg-background border-border hover:bg-muted/50 ';
  }
  
  return (
    <button
      className={className}
      onClick={onClick}
      disabled={isAnswered}
    >
      <div className="flex items-start">
        <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-muted/50 text-sm font-medium mr-3 mt-0.5">
          {letterIndex}
        </span>
        <span className={`flex-1 text-${isAnswered && isCorrect ? 'green-600 dark:text-green-400' : 'foreground'}`}>
          {option}
        </span>
        {isAnswered && selected && isCorrect && (
          <CheckCircle className="h-5 w-5 text-green-500 ml-2" />
        )}
        {isAnswered && selected && !isCorrect && (
          <XCircle className="h-5 w-5 text-red-500 ml-2" />
        )}
      </div>
    </button>
  );
});

QuizOptionButton.displayName = 'QuizOptionButton';

const QuizCard: React.FC<QuizCardProps> = ({
  question,
  options,
  correctAnswer,
  explanation,
  onNextQuestion,
  onCompleted,
  isLastQuestion,
  currentQuestion,
  totalQuestions,
  correctQuestions,
  incorrectQuestions
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Memoized handlers to prevent unnecessary recreations
  const handleOptionSelect = useCallback((index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
  }, [isAnswered]);

  const handleCheckAnswer = useCallback(() => {
    if (selectedOption === null) return;
    
    const correct = selectedOption === correctAnswer;
    setIsCorrect(correct);
    setIsAnswered(true);
    
    if (correct) {
      correctQuestions.push(currentQuestion);
    } else {
      incorrectQuestions.push(currentQuestion);
    }
  }, [selectedOption, correctAnswer, correctQuestions, incorrectQuestions, currentQuestion]);

  const handleNext = useCallback(() => {
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
    
    if (isLastQuestion) {
      onCompleted(correctQuestions, incorrectQuestions);
    } else {
      onNextQuestion();
    }
  }, [isLastQuestion, onCompleted, correctQuestions, incorrectQuestions, onNextQuestion]);

  // Calculate progress percentage
  const progressPercentage = Math.max(0, Math.min(100, (currentQuestion / totalQuestions) * 100));

  return (
    <div className="bg-card dark:bg-darkBlue-900/50 rounded-xl shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-muted-foreground">
            Question {currentQuestion} of {totalQuestions}
          </span>
          <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
        
        <h3 className="text-lg font-medium text-foreground mb-4">{question}</h3>
        
        <div className="space-y-3 mb-6">
          {options.map((option, index) => (
            <QuizOptionButton
              key={`option-${index}`}
              option={option}
              index={index}
              selected={selectedOption === index}
              isAnswered={isAnswered}
              isCorrect={index === correctAnswer}
              onClick={() => handleOptionSelect(index)}
            />
          ))}
        </div>
        
        {isAnswered && (
          <div className={`p-4 rounded-lg mb-6 ${
            isCorrect 
              ? 'bg-green-500/10 border border-green-500/30 dark:bg-green-500/5 dark:border-green-500/20'
              : 'bg-red-500/10 border border-red-500/30 dark:bg-red-500/5 dark:border-red-500/20'
          }`}>
            <div className="flex items-start">
              {isCorrect 
                ? <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                : <XCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
              }
              <div>
                <h4 className={`font-medium text-${isCorrect ? 'green-600 dark:text-green-400' : 'red-600 dark:text-red-400'} mb-1`}>
                  {isCorrect ? 'Correct!' : 'Incorrect!'}
                </h4>
                <p className="text-muted-foreground text-sm">{explanation}</p>
              </div>
            </div>
          </div>
        )}
        
        {!isAnswered ? (
          <Button 
            onClick={handleCheckAnswer} 
            disabled={selectedOption === null}
            className="w-full bg-primary hover:bg-primary/90"
          >
            Check Answer
          </Button>
        ) : (
          <Button onClick={handleNext} className="w-full bg-primary hover:bg-primary/90">
            {isLastQuestion ? 'See Results' : 'Next Question'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default memo(QuizCard);


import React, { useState } from 'react';
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

  const handleOptionSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null) return;
    
    const correct = selectedOption === correctAnswer;
    setIsCorrect(correct);
    setIsAnswered(true);
    
    if (correct) {
      correctQuestions.push(currentQuestion);
    } else {
      incorrectQuestions.push(currentQuestion);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
    
    if (isLastQuestion) {
      onCompleted(correctQuestions, incorrectQuestions);
    } else {
      onNextQuestion();
    }
  };

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
              style={{ width: `${(currentQuestion / totalQuestions) * 100}%` }}
            ></div>
          </div>
        </div>
        
        <h3 className="text-lg font-medium text-foreground mb-4">{question}</h3>
        
        <div className="space-y-3 mb-6">
          {options.map((option, index) => (
            <button
              key={index}
              className={`w-full text-left p-3 rounded-lg border transition-all ${
                selectedOption === index 
                  ? isAnswered 
                    ? index === correctAnswer 
                      ? 'bg-green-500/10 border-green-500/30 dark:bg-green-500/5 dark:border-green-500/20'
                      : 'bg-red-500/10 border-red-500/30 dark:bg-red-500/5 dark:border-red-500/20'
                    : 'bg-primary/10 border-primary/30 dark:bg-primary/5 dark:border-primary/20' 
                  : isAnswered && index === correctAnswer
                    ? 'bg-green-500/10 border-green-500/30 dark:bg-green-500/5 dark:border-green-500/20'
                    : 'bg-background border-border hover:bg-muted/50'
              }`}
              onClick={() => handleOptionSelect(index)}
              disabled={isAnswered}
            >
              <div className="flex items-start">
                <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-muted/50 text-sm font-medium mr-3 mt-0.5">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className={`flex-1 text-${isAnswered && index === correctAnswer ? 'green-600 dark:text-green-400' : 'foreground'}`}>
                  {option}
                </span>
                {isAnswered && index === selectedOption && index === correctAnswer && (
                  <CheckCircle className="h-5 w-5 text-green-500 ml-2" />
                )}
                {isAnswered && index === selectedOption && index !== correctAnswer && (
                  <XCircle className="h-5 w-5 text-red-500 ml-2" />
                )}
              </div>
            </button>
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

export default QuizCard;

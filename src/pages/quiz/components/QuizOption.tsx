import React, { memo, useMemo, useCallback } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface QuizOptionProps {
  option: string;
  index: number;
  selected: boolean;
  isCorrect: boolean | null;
  isAnswered: boolean;
  correctAnswer: string;
  onSelect: () => void;
}

const QuizOption = memo(({
  option,
  index,
  selected,
  isCorrect,
  isAnswered,
  correctAnswer,
  onSelect
}: QuizOptionProps) => {
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
  
  // Use a callback for the onClick handler to prevent recreation
  const handleClick = useCallback(() => {
    if (!isAnswered) {
      onSelect();
    }
  }, [isAnswered, onSelect]);

  return (
    <div onClick={handleClick} className={classes}>
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

QuizOption.displayName = 'QuizOption';

export default QuizOption;
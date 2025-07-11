import React, { useMemo } from 'react';

interface QuizProgressProps {
  currentIndex: number;
  totalQuestions: number;
}

const QuizProgress: React.FC<QuizProgressProps> = ({
  currentIndex,
  totalQuestions
}) => {
  // Compute progress once
  const progressPercentage = useMemo(() => 
    Math.floor(((currentIndex) / totalQuestions) * 100), 
    [currentIndex, totalQuestions]
  );

  return (
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
  );
};

export default QuizProgress;
import React, { useCallback } from 'react';
import { Button } from '@/components/ui/button';

interface QuizActionsProps {
  currentIndex: number;
  totalQuestions: number;
  isAnswered: boolean;
  questionId?: string;
  onNextQuestion: () => void;
}

const QuizActions: React.FC<QuizActionsProps> = ({
  currentIndex,
  totalQuestions,
  isAnswered,
  questionId,
  onNextQuestion
}) => {
  // Memoize handlers to prevent recreations on each render
  const handleNextQuestion = useCallback(() => {
    onNextQuestion();
  }, [onNextQuestion]);

  return (
    <div className="flex justify-between pt-4">
      <div className="text-sm text-white/60">
        ID: {questionId}
      </div>
      <Button 
        onClick={handleNextQuestion}
        disabled={!isAnswered}
        className="bg-primary hover:bg-primary/90"
      >
        {currentIndex === totalQuestions - 1 ? 'Finish Quiz' : 'Next Question'}
      </Button>
    </div>
  );
};

export default QuizActions;
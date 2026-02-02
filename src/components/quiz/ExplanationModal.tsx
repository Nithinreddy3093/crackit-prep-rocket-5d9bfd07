import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle } from 'lucide-react';

interface ExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
  isCorrect: boolean;
  explanation: string;
  correctAnswer: string;
  userAnswer: string;
}

const ExplanationModal: React.FC<ExplanationModalProps> = ({
  isOpen,
  onClose,
  isCorrect,
  explanation,
  correctAnswer,
  userAnswer,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isCorrect ? (
              <>
                <CheckCircle className="h-6 w-6 text-green-500" />
                <span className="text-green-500">Correct Answer!</span>
              </>
            ) : (
              <>
                <XCircle className="h-6 w-6 text-red-500" />
                <span className="text-red-500">Incorrect Answer</span>
              </>
            )}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {isCorrect ? 'You answered correctly.' : 'Your answer was incorrect.'} See the explanation below.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {!isCorrect && (
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
              <p className="text-sm text-muted-foreground mb-1">Your answer:</p>
              <p className="font-semibold text-foreground">{userAnswer}</p>
            </div>
          )}

          <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
            <p className="text-sm text-muted-foreground mb-1">Correct answer:</p>
            <p className="font-semibold text-foreground">{correctAnswer}</p>
          </div>

          {explanation && (
            <div className="p-4 rounded-lg bg-muted/50">
              <p className="text-sm font-semibold text-foreground mb-2">Explanation:</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{explanation}</p>
            </div>
          )}
        </div>

        <div className="flex justify-end mt-6">
          <Button onClick={onClose}>Continue</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExplanationModal;

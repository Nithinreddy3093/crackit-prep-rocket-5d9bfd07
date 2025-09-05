import React from 'react';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface QuestionValidationFeedbackProps {
  isValidating: boolean;
  isCorrect?: boolean;
  correctAnswer?: string;
  explanation?: string;
  userAnswer?: string;
  show: boolean;
}

const QuestionValidationFeedback: React.FC<QuestionValidationFeedbackProps> = ({
  isValidating,
  isCorrect,
  correctAnswer,
  explanation,
  userAnswer,
  show
}) => {
  if (!show) return null;

  return (
    <Card className={`mt-4 transition-all duration-300 ${
      isValidating 
        ? 'bg-blue-500/10 border-blue-500/30' 
        : isCorrect 
          ? 'bg-green-500/10 border-green-500/30' 
          : 'bg-red-500/10 border-red-500/30'
    }`}>
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className="mt-1">
            {isValidating ? (
              <Loader2 className="h-5 w-5 animate-spin text-blue-400" />
            ) : isCorrect ? (
              <CheckCircle className="h-5 w-5 text-green-400" />
            ) : (
              <XCircle className="h-5 w-5 text-red-400" />
            )}
          </div>
          
          <div className="flex-grow space-y-2">
            {isValidating ? (
              <div>
                <p className="text-blue-400 font-medium">Validating your answer...</p>
                <p className="text-white/60 text-sm">Please wait while we check your response.</p>
              </div>
            ) : (
              <div>
                <p className={`font-medium ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                  {isCorrect ? '🎉 Correct!' : '❌ Incorrect'}
                </p>
                
                <div className="space-y-1 text-sm">
                  <p className="text-white/80">
                    <span className="text-white/60">Your answer:</span> {userAnswer}
                  </p>
                  
                  {!isCorrect && correctAnswer && (
                    <p className="text-green-400">
                      <span className="text-white/60">Correct answer:</span> {correctAnswer}
                    </p>
                  )}
                  
                  {explanation && (
                    <div className="mt-2 p-3 bg-white/5 rounded-lg">
                      <p className="text-white/60 text-xs font-medium mb-1">EXPLANATION</p>
                      <p className="text-white/80 text-sm">{explanation}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionValidationFeedback;
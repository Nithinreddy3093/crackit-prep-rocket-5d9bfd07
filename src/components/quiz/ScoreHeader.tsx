
import { CheckCircle, Loader2, XCircle } from 'lucide-react';

interface ScoreHeaderProps {
  percentage: number;
  score: number;
  totalQuestions: number;
  savingProgress: boolean;
  progressSaved: boolean;
  isAuthenticated: boolean;
}

const ScoreHeader: React.FC<ScoreHeaderProps> = ({
  percentage,
  score,
  totalQuestions,
  savingProgress,
  progressSaved,
  isAuthenticated
}) => {
  return (
    <div className="mb-6 text-center">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 dark:bg-primary/20 mb-4">
        <span className="text-2xl font-bold text-primary">{percentage}%</span>
      </div>
      <h3 className="text-xl font-semibold text-foreground">
        Your Quiz Results
      </h3>
      <p className="text-muted-foreground mt-1">
        You scored {score} out of {totalQuestions} questions
      </p>
      
      {isAuthenticated && (
        <div className="mt-2 flex items-center justify-center gap-2 text-sm">
          {savingProgress ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin text-primary" />
              <span className="text-muted-foreground">Saving progress...</span>
            </>
          ) : progressSaved ? (
            <>
              <CheckCircle className="h-3 w-3 text-green-500" />
              <span className="text-green-500">Progress saved to your profile</span>
            </>
          ) : (
            <>
              <XCircle className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground">Progress not saved</span>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ScoreHeader;

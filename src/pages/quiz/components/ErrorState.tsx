
import React from 'react';
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  errorMessage: string;
  onRetry: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ errorMessage, onRetry }) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-destructive mb-4">Error</h2>
        <p className="text-muted-foreground">
          {errorMessage}
        </p>
        <Button variant="outline" onClick={onRetry} className="mt-4">
          Go back to topics
        </Button>
      </div>
    </div>
  );
};

export default ErrorState;

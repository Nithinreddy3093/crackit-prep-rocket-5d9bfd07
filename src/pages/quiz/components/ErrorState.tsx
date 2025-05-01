
import React from 'react';
import { Button } from "@/components/ui/button";
import { AlertCircle } from 'lucide-react';

interface ErrorStateProps {
  errorMessage: string;
  onRetry: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ errorMessage, onRetry }) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center max-w-md animate-fade-in-up">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
        </div>
        <h2 className="text-2xl font-semibold text-white mb-3">Something went wrong</h2>
        <p className="text-gray-400 mb-6">
          {errorMessage}
        </p>
        <Button 
          onClick={onRetry} 
          className="bg-primary hover:bg-primary/90"
        >
          Go back to topics
        </Button>
      </div>
    </div>
  );
};

export default ErrorState;

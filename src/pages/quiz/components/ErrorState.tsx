
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

interface ErrorStateProps {
  errorMessage: string;
  onRetry: () => void;
  topicId?: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({ errorMessage, onRetry, topicId }) => {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    await onRetry();
    setTimeout(() => setIsRetrying(false), 1000);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <motion.div 
          className="flex justify-center mb-4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-red-500/20">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
        </motion.div>
        
        <h2 className="text-2xl font-semibold text-foreground mb-3">
          Oops! Something went wrong
        </h2>
        
        <p className="text-muted-foreground mb-2">
          {errorMessage}
        </p>
        
        {topicId && (
          <p className="text-sm text-muted-foreground/70 mb-6">
            Topic: <span className="font-medium text-primary">{topicId}</span>
          </p>
        )}
        
        <div className="flex gap-3 justify-center">
          <Button 
            onClick={handleRetry}
            disabled={isRetrying}
            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
          >
            {isRetrying ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Retrying...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </>
            )}
          </Button>
          
          <Button 
            onClick={() => window.location.href = '/topics'}
            variant="outline"
            className="border-border hover:bg-accent"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Topics
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default ErrorState;

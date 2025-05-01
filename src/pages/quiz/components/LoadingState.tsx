
import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingState: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-primary/30 animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-darkBlue-900 via-darkBlue-800 to-darkBlue-700 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
          </div>
        </div>
      </div>
      <h2 className="mt-6 text-xl font-semibold text-white">Loading Quiz...</h2>
      <p className="mt-2 text-blue-300 text-center max-w-xs">
        Preparing your questions and getting everything ready
      </p>
    </div>
  );
};

export default LoadingState;

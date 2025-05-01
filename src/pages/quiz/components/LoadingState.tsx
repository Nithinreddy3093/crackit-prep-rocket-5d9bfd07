
import React from 'react';

const LoadingState: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent animate-pulse-slow flex items-center justify-center">
        <div className="w-3 h-3 bg-white rounded-full"></div>
      </div>
    </div>
  );
};

export default LoadingState;

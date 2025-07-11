import React from 'react';
import { Clock } from 'lucide-react';

interface QuizHeaderProps {
  topicTitle?: string;
  elapsedTime: number;
  formatTime: (ms: number) => string;
}

const QuizHeader: React.FC<QuizHeaderProps> = ({
  topicTitle,
  elapsedTime,
  formatTime
}) => {
  return (
    <div className="flex justify-between items-center">
      <div className="text-white">
        <span className="text-sm font-light">Topic:</span>
        <h3 className="text-lg font-semibold">{topicTitle || 'General Knowledge'}</h3>
      </div>
      <div className="flex items-center space-x-1 text-white/90 bg-darkBlue-800/50 px-3 py-1 rounded-full">
        <Clock className="h-4 w-4" />
        <span className="text-sm font-mono">{formatTime(elapsedTime)}</span>
      </div>
    </div>
  );
};

export default QuizHeader;
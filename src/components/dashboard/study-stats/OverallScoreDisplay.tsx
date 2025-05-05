
import React from 'react';

interface OverallScoreDisplayProps {
  overallScore: number;
}

const OverallScoreDisplay: React.FC<OverallScoreDisplayProps> = ({ overallScore }) => {
  return (
    <div className="flex items-center px-4 py-2 bg-primary/10 rounded-md">
      <div className="text-md font-semibold mr-2">Overall Score:</div>
      <div className="text-2xl font-bold text-primary">{overallScore}%</div>
    </div>
  );
};

export default OverallScoreDisplay;

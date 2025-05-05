
import React from 'react';
import { LineChart } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { StrengthAreaProps } from './types';

const ImprovementAreas: React.FC<StrengthAreaProps> = ({ areas, loading }) => {
  return (
    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
      <h4 className="flex items-center mb-2">
        <LineChart className="h-4 w-4 text-red-400 mr-2" />
        <span className="text-white font-medium">Areas to Improve</span>
      </h4>
      {loading ? (
        <div className="space-y-2">
          <Skeleton className="h-4 w-full bg-darkBlue-700" />
          <Skeleton className="h-4 w-3/4 bg-darkBlue-700" />
        </div>
      ) : (
        <ul className="space-y-1">
          {areas.length > 0 ? (
            areas.map((area, index) => (
              <li key={index} className="text-white/80 text-sm flex items-center">
                <span className="mr-2">•</span> {area}
              </li>
            ))
          ) : (
            <li className="text-white/80 text-sm">Complete more quizzes to identify areas for improvement</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default ImprovementAreas;


import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const LoadingSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((_, index) => (
        <div key={index} className="h-64 rounded-xl bg-darkBlue-800/50 animate-pulse">
          <Skeleton className="h-full w-full rounded-xl" />
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;

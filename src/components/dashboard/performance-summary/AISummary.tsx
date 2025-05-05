
import React from 'react';
import { Brain } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface AISummaryProps {
  summary: string;
  loading: boolean;
}

const AISummary: React.FC<AISummaryProps> = ({ summary, loading }) => {
  return (
    <div className="bg-primary/10 border border-primary/30 rounded-xl p-4">
      <div className="flex items-center mb-2">
        <Brain className="h-5 w-5 text-primary mr-2" />
        <span className="text-white font-medium">AI Performance Summary</span>
      </div>
      {loading ? (
        <div className="space-y-2">
          <Skeleton className="h-4 w-full bg-darkBlue-700" />
          <Skeleton className="h-4 w-3/4 bg-darkBlue-700" />
        </div>
      ) : (
        <p className="text-white/80 text-sm">{summary}</p>
      )}
    </div>
  );
};

export default AISummary;

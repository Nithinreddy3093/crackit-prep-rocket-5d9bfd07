import React from 'react';
import { AlertCircle, TrendingDown, ArrowRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useBadgeSystem } from '@/hooks/useBadgeSystem';

interface DynamicImprovementAreasProps {
  forceRefresh?: boolean;
}

const DynamicImprovementAreas: React.FC<DynamicImprovementAreasProps> = ({ forceRefresh }) => {
  const { strengths, loading } = useBadgeSystem(forceRefresh);
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4">
        <div className="flex items-center mb-3">
          <TrendingDown className="h-4 w-4 text-orange-400 mr-2" />
          <span className="text-white font-medium">Areas to Improve</span>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full bg-darkBlue-700" />
          <Skeleton className="h-4 w-3/4 bg-darkBlue-700" />
        </div>
      </div>
    );
  }

  // No weaknesses - user is doing great!
  if (strengths.weaknesses.length === 0) {
    return (
      <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/5 border border-blue-500/20 rounded-xl p-4">
        <div className="flex items-center mb-2">
          <AlertCircle className="h-4 w-4 text-blue-400 mr-2" />
          <span className="text-white font-medium">Keep Exploring</span>
        </div>
        <p className="text-white/70 text-sm">
          No weak areas detected! Try more topics to expand your knowledge.
        </p>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/topics')}
          className="mt-2 text-blue-400 hover:text-blue-300 p-0 h-auto"
        >
          Explore Topics <ArrowRight className="h-3 w-3 ml-1" />
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-orange-500/10 to-red-500/5 border border-orange-500/20 rounded-xl p-4">
      <div className="flex items-center mb-3">
        <TrendingDown className="h-4 w-4 text-orange-400 mr-2" />
        <span className="text-white font-medium">Areas to Improve</span>
      </div>
      
      <div className="space-y-3">
        {strengths.weaknesses.slice(0, 3).map((weakness) => (
          <div 
            key={weakness.topic}
            className="bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-colors cursor-pointer"
            onClick={() => navigate(`/topics`)}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/90 text-sm font-medium">
                {weakness.displayName}
              </span>
              <span className="text-orange-400 font-semibold text-sm">
                {weakness.accuracy}%
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Progress 
                value={weakness.accuracy} 
                className="h-1.5 flex-1 bg-white/10 [&>div]:bg-orange-500"
              />
              <span className="text-white/50 text-xs">
                {weakness.attempts} attempts
              </span>
            </div>
          </div>
        ))}
      </div>

      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => navigate('/topics')}
        className="mt-3 text-orange-400 hover:text-orange-300 p-0 h-auto text-xs"
      >
        Practice these topics <ArrowRight className="h-3 w-3 ml-1" />
      </Button>
    </div>
  );
};

export default DynamicImprovementAreas;

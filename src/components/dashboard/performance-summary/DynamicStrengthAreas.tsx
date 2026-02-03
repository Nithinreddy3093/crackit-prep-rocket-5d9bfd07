import React from 'react';
import { CheckCircle, Flame, Target, TrendingUp, Sparkles } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useBadgeSystem } from '@/hooks/useBadgeSystem';
import { BADGE_TIER_COLORS, TopicStrength } from '@/services/badgeEngine';

interface DynamicStrengthAreasProps {
  forceRefresh?: boolean;
}

const DynamicStrengthAreas: React.FC<DynamicStrengthAreasProps> = ({ forceRefresh }) => {
  const { strengths, loading } = useBadgeSystem(forceRefresh);
  const navigate = useNavigate();

  const getTierBadgeStyle = (tier: TopicStrength['tier']) => {
    const colors = BADGE_TIER_COLORS[tier];
    return `bg-gradient-to-r ${colors.bg} ${colors.border} border`;
  };

  if (loading) {
    return (
      <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
        <div className="flex items-center mb-3">
          <Sparkles className="h-4 w-4 text-green-400 mr-2" />
          <span className="text-white font-medium">Your Strengths</span>
        </div>
        <div className="space-y-3">
          <Skeleton className="h-16 w-full bg-darkBlue-700" />
          <Skeleton className="h-16 w-full bg-darkBlue-700" />
        </div>
      </div>
    );
  }

  // No strengths yet - show meaningful CTA
  if (strengths.strengths.length === 0) {
    return (
      <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/20 rounded-xl p-4">
        <div className="flex items-center mb-3">
          <Target className="h-4 w-4 text-green-400 mr-2" />
          <span className="text-white font-medium">Discover Your Strengths 💪</span>
        </div>
        <div className="text-center py-4">
          <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-green-500/20 flex items-center justify-center">
            <TrendingUp className="h-8 w-8 text-green-400" />
          </div>
          <p className="text-white/80 text-sm mb-3">
            Complete <span className="text-green-400 font-semibold">3 quizzes</span> in any topic 
            with <span className="text-green-400 font-semibold">75%+ accuracy</span> to unlock your first strength!
          </p>
          <Button 
            size="sm"
            onClick={() => navigate('/topics')}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Start a Quiz
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/20 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
          <span className="text-white font-medium">Your Strengths 💪</span>
        </div>
        <Badge variant="outline" className="text-green-400 border-green-400/30 text-xs">
          {strengths.strengths.length} Topic{strengths.strengths.length > 1 ? 's' : ''}
        </Badge>
      </div>
      
      <div className="space-y-3">
        {strengths.strengths.slice(0, 3).map((strength, index) => (
          <div 
            key={strength.topic}
            className="bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-colors cursor-pointer"
            onClick={() => navigate(`/topics`)}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-white font-medium text-sm">
                  {strength.displayName}
                </span>
                <Badge 
                  className={`text-[10px] px-1.5 py-0 ${getTierBadgeStyle(strength.tier)} text-white`}
                >
                  {strength.tier.charAt(0).toUpperCase() + strength.tier.slice(1)}
                </Badge>
              </div>
              <span className="text-green-400 font-bold text-sm">
                {strength.accuracy}%
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Progress 
                value={strength.accuracy} 
                className="h-1.5 flex-1 bg-white/10"
              />
              <span className="text-white/50 text-xs">
                {strength.attempts} quiz{strength.attempts > 1 ? 'zes' : ''}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Recommendations */}
      {strengths.recommendations.length > 0 && (
        <div className="mt-3 pt-3 border-t border-green-500/20">
          <p className="text-white/60 text-xs flex items-center">
            <Flame className="h-3 w-3 text-orange-400 mr-1" />
            {strengths.recommendations[0]}
          </p>
        </div>
      )}
    </div>
  );
};

export default DynamicStrengthAreas;

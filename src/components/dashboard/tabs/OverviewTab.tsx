
import React from 'react';
import { MousePointerClick, ListChecks, Trophy, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import RecentActivity from '@/components/dashboard/RecentActivity';
import { ActivityItem } from '@/types/dashboard';
import UpcomingQuizzes from '@/components/dashboard/UpcomingQuizzes';
import AiRecommendations from '@/components/dashboard/AiRecommendations';
import PerformanceSummary from '@/components/dashboard/PerformanceSummary';
import { useBadgeSystem } from '@/hooks/useBadgeSystem';
import { BADGE_TIER_COLORS } from '@/services/badgeEngine';

interface OverviewTabProps {
  activities: ActivityItem[];
  isLoading: boolean;
  setActiveTab: (tab: string) => void;
  user: any;
  forceRefresh?: boolean;
}

// Mock data
const upcomingQuizzes = [
  { id: 1, name: 'Advanced Data Structures', date: '2025-05-15', timeEstimate: '30 min' },
  { id: 2, name: 'SQL Query Optimization', date: '2025-05-18', timeEstimate: '25 min' },
  { id: 3, name: 'Process Scheduling Algorithms', date: '2025-05-20', timeEstimate: '20 min' },
];

const OverviewTab: React.FC<OverviewTabProps> = ({ activities, isLoading, setActiveTab, forceRefresh }) => {
  const { stats, streak, loading: badgeLoading } = useBadgeSystem(forceRefresh);

  return (
    <>
      {/* Performance Summary */}
      <PerformanceSummary forceRefresh={forceRefresh} />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 hover:shadow-blue-500/10 dashboard-card-hover">
          <h3 className="section-title">
            <MousePointerClick className="section-icon" />
            Recent Activity
          </h3>
          <RecentActivity 
            activities={activities} 
            onViewAllActivity={() => setActiveTab("progress")} 
          />
        </div>
        
        <div className="glass-card p-6 hover:shadow-blue-500/10 dashboard-card-hover">
          <h3 className="section-title">
            <ListChecks className="section-icon" />
            Upcoming Quizzes
          </h3>
          <UpcomingQuizzes quizzes={upcomingQuizzes} />
        </div>
        
        <div className="glass-card p-6 hover:shadow-blue-500/10 dashboard-card-hover">
          <h3 className="section-title">
            <Sparkles className="section-icon text-yellow-400" />
            Your Achievements
          </h3>
          <div className="space-y-3">
            {/* Badge Stats */}
            <div className="flex items-center justify-between">
              <span className="text-white/80">Badges Earned</span>
              <span className="font-bold text-yellow-400">
                {badgeLoading ? '...' : (stats?.totalEarned || 0)}
              </span>
            </div>
            
            {/* Streak */}
            {streak && streak.currentStreak > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-white/80">Current Streak</span>
                <span className="font-bold text-orange-400">
                  🔥 {streak.currentStreak} days
                </span>
              </div>
            )}
            
            {/* Badge tier breakdown */}
            {stats && stats.totalEarned > 0 && (
              <div className="flex gap-2 flex-wrap">
                {Object.entries(stats.byTier)
                  .filter(([, count]) => count > 0)
                  .map(([tier, count]) => (
                    <span 
                      key={tier}
                      className={`text-xs px-2 py-1 rounded-full bg-gradient-to-r ${BADGE_TIER_COLORS[tier as keyof typeof BADGE_TIER_COLORS].bg} text-white`}
                    >
                      {count} {tier}
                    </span>
                  ))
                }
              </div>
            )}
            
            {/* Progress to next badge */}
            {stats && stats.lockedWithProgress.length > 0 && (
              <div className="bg-white/5 rounded-lg p-2">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-white/60">Next: {stats.lockedWithProgress[0].name}</span>
                  <span className="text-primary">{stats.lockedWithProgress[0].progress}%</span>
                </div>
                <Progress value={stats.lockedWithProgress[0].progress} className="h-1.5 bg-white/10" />
              </div>
            )}
            
            <Button
              onClick={() => setActiveTab("achievements")}
              variant="outline"
              size="sm"
              className="w-full mt-2 text-primary border-primary/30 hover:bg-primary/10"
            >
              View All Achievements
            </Button>
          </div>
        </div>
      </div>
      
      <div className="glass-card p-6 hover:shadow-blue-500/10 dashboard-card-hover">
        <h3 className="section-title">
          <Trophy className="section-icon" />
          AI Recommendations
        </h3>
        <AiRecommendations forceRefresh={forceRefresh} />
      </div>
    </>
  );
};

export default OverviewTab;

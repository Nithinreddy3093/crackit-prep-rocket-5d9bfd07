
import React from 'react';
import { MousePointerClick, ListChecks, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import RecentActivity, { ActivityItem } from '@/components/dashboard/RecentActivity';
import UpcomingQuizzes from '@/components/dashboard/UpcomingQuizzes';
import AiRecommendations from '@/components/dashboard/AiRecommendations';
import PopularTopics from '@/components/dashboard/PopularTopics';
import PerformanceSummary from '@/components/dashboard/PerformanceSummary';

interface OverviewTabProps {
  activities: ActivityItem[];
  isLoading: boolean;
  setActiveTab: (tab: string) => void;
  user: any;
}

// Mock data
const upcomingQuizzes = [
  { id: 1, name: 'Advanced Data Structures', date: '2025-04-15', timeEstimate: '30 min' },
  { id: 2, name: 'SQL Query Optimization', date: '2025-04-18', timeEstimate: '25 min' },
  { id: 3, name: 'Process Scheduling Algorithms', date: '2025-04-20', timeEstimate: '20 min' },
];

const OverviewTab: React.FC<OverviewTabProps> = ({ activities, isLoading, setActiveTab }) => {
  return (
    <>
      {/* Performance Summary */}
      <PerformanceSummary />
      
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
            <Trophy className="section-icon" />
            Your Achievements
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-white/80">Quizzes Completed</span>
              <span className="font-bold text-primary">
                {isLoading ? '...' : (activities.filter(a => a.type === 'quiz').length)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/80">Total Score</span>
              <span className="font-bold text-primary">
                {isLoading ? '...' : '85%'}
              </span>
            </div>
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
        <AiRecommendations />
      </div>

      <div className="glass-card p-6 hover:shadow-blue-500/10 dashboard-card-hover">
        <h3 className="section-title">
          <Trophy className="section-icon" />
          Popular Topics
        </h3>
        <PopularTopics />
      </div>
    </>
  );
};

export default OverviewTab;

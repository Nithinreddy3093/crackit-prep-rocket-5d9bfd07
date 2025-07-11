
import React from 'react';
import { BarChart3, ListChecks, BookOpenCheck } from 'lucide-react';
import { ActivityItem } from '@/types/dashboard';
import StudyStats from '@/components/dashboard/StudyStats';
import ActivityHistory from '@/components/dashboard/ActivityHistory';

interface ProgressTabProps {
  activities: ActivityItem[];
  forceRefresh?: boolean;
}

const ProgressTab: React.FC<ProgressTabProps> = ({ activities, forceRefresh }) => {
  return (
    <>
      <div className="glass-card p-6 hover:shadow-blue-500/10 dashboard-card-hover">
        <h3 className="section-title">
          <BarChart3 className="section-icon" />
          Your Learning Progress
        </h3>
        <StudyStats forceRefresh={forceRefresh} />
      </div>
      <div className="glass-card p-6 hover:shadow-blue-500/10 dashboard-card-hover">
        <h3 className="section-title">
          <ListChecks className="section-icon" />
          Activity Timeline
        </h3>
        <ActivityHistory activities={activities} />
      </div>
      <div className="glass-card p-6 hover:shadow-blue-500/10 dashboard-card-hover">
        <h3 className="section-title">
          <BookOpenCheck className="section-icon" />
          Recent Quiz Results
        </h3>
        <div className="space-y-4">
          {activities.length > 0 ? (
            activities
              .filter(activity => activity.type === 'quiz')
              .slice(0, 5)
              .map((quiz, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                  <div>
                    <h4 className="font-medium text-white">{quiz.name}</h4>
                    <p className="text-sm text-white/70">{new Date(quiz.date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary">{quiz.score}</div>
                    <p className="text-xs text-white/70">{quiz.topic}</p>
                  </div>
                </div>
              ))
          ) : (
            <div className="text-center py-4 text-white/60">
              No quiz results found. Take a quiz to see your results here.
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProgressTab;

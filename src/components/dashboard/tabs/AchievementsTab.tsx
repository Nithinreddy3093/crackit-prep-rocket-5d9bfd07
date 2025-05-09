
import React, { useEffect, useState } from 'react';
import { Trophy } from 'lucide-react';
import Badges from '@/components/dashboard/Badges';
import { Skeleton } from '@/components/ui/skeleton';

interface AchievementsTabProps {
  forceRefresh?: boolean;
}

const AchievementsTab: React.FC<AchievementsTabProps> = ({ forceRefresh }) => {
  return (
    <>
      <div className="glass-card p-6 hover:shadow-blue-500/10 dashboard-card-hover">
        <h3 className="section-title">
          <Trophy className="section-icon" />
          Your Badges & Achievements
        </h3>
        <Badges forceRefresh={forceRefresh} />
      </div>
    </>
  );
};

export default AchievementsTab;

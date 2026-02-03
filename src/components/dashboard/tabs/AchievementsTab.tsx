
import React from 'react';
import PremiumBadges from '@/components/dashboard/PremiumBadges';

interface AchievementsTabProps {
  forceRefresh?: boolean;
}

const AchievementsTab: React.FC<AchievementsTabProps> = ({ forceRefresh }) => {
  return (
    <div className="space-y-6">
      <PremiumBadges forceRefresh={forceRefresh} showCategories={true} />
    </div>
  );
};

export default AchievementsTab;

import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardTabs from '@/components/dashboard/DashboardTabs';
import WelcomeSection from '@/components/dashboard/WelcomeSection';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useDashboardEffects } from '@/hooks/useDashboardEffects';

const Dashboard = () => {
  const {
    user,
    recentActivities,
    activitiesLoading,
    forceRefresh
  } = useDashboardData();

  // Handle welcome toast and other side effects
  useDashboardEffects(user);

  return (
    <DashboardLayout>
      {/* Welcome Section with new styling */}
      <WelcomeSection userName={user?.name || 'User'} />
      
      {/* Dashboard Tabs with updated styling */}
      <DashboardTabs 
        user={user}
        recentActivities={recentActivities}
        activitiesLoading={activitiesLoading}
        forceRefresh={forceRefresh}
      />
    </DashboardLayout>
  );
};

export default Dashboard;
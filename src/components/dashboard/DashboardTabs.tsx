import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Layout, BarChart3, BookMarked, Trophy } from 'lucide-react';
import OverviewTab from '@/components/dashboard/tabs/OverviewTab';
import ProgressTab from '@/components/dashboard/tabs/ProgressTab';
import ResourcesTab from '@/components/dashboard/tabs/ResourcesTab';
import AchievementsTab from '@/components/dashboard/tabs/AchievementsTab';
import { ActivityItem } from '@/types/dashboard';

interface User {
  id?: string;
  name?: string;
}

interface DashboardTabsProps {
  user: User | null;
  recentActivities: ActivityItem[];
  activitiesLoading: boolean;
  forceRefresh: boolean;
}

const DashboardTabs: React.FC<DashboardTabsProps> = ({
  user,
  recentActivities,
  activitiesLoading,
  forceRefresh
}) => {
  const [activeTab, setActiveTab] = useState("overview");

  // Shared data for different tabs
  const sharedProps = {
    activities: recentActivities,
    isLoading: activitiesLoading,
    setActiveTab,
    user,
    forceRefresh
  };

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full max-w-xl mx-auto mb-8 bg-white/5 backdrop-blur-md border border-white/10">
            <TabsTrigger value="overview" className="text-gray-300 hover:text-white data-[state=active]:bg-primary/20">
              <Layout className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="progress" className="text-gray-300 hover:text-white data-[state=active]:bg-primary/20">
              <BarChart3 className="h-4 w-4 mr-2" />
              Progress
            </TabsTrigger>
            <TabsTrigger value="resources" className="text-gray-300 hover:text-white data-[state=active]:bg-primary/20">
              <BookMarked className="h-4 w-4 mr-2" />
              Resources
            </TabsTrigger>
            <TabsTrigger value="achievements" className="text-gray-300 hover:text-white data-[state=active]:bg-primary/20">
              <Trophy className="h-4 w-4 mr-2" />
              Achievements
            </TabsTrigger>
          </TabsList>
          
          {/* Tab contents */}
          <TabsContent value="overview" className="space-y-8 animate-fade-in-up">
            <OverviewTab {...sharedProps} />
          </TabsContent>
          
          <TabsContent value="progress" className="space-y-8 animate-fade-in-up">
            <ProgressTab activities={recentActivities} forceRefresh={forceRefresh} />
          </TabsContent>
          
          <TabsContent value="resources" className="space-y-8 animate-fade-in-up">
            <ResourcesTab />
          </TabsContent>
          
          <TabsContent value="achievements" className="space-y-8 animate-fade-in-up">
            <AchievementsTab forceRefresh={forceRefresh} />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default DashboardTabs;

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from "@/components/ui/use-toast";
import { Layout, BarChart3, BookMarked, Trophy } from 'lucide-react';
import { getPerformanceHistory } from '@/services/performance/userPerformanceService';

// Import dashboard tab content components
import OverviewTab from '@/components/dashboard/tabs/OverviewTab';
import ProgressTab from '@/components/dashboard/tabs/ProgressTab';
import ResourcesTab from '@/components/dashboard/tabs/ResourcesTab';
import AchievementsTab from '@/components/dashboard/tabs/AchievementsTab';
import WelcomeSection from '@/components/dashboard/WelcomeSection';

// Activity item type
export interface ActivityItem {
  id: number;
  type: 'quiz' | 'resource';
  name: string;
  score?: string;
  date: string;
  topic: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [recentActivities, setRecentActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Only show welcome toast once per session
    const hasSeenWelcome = sessionStorage.getItem('hasSeenWelcome');
    if (!hasSeenWelcome) {
      setTimeout(() => {
        toast({
          title: `Welcome back, ${user?.name}!`,
          description: "Your dashboard has been updated with new features.",
          variant: "default",
        });
        sessionStorage.setItem('hasSeenWelcome', 'true');
      }, 1000);
    }

    // Fetch real activity data
    const fetchActivities = async () => {
      if (user) {
        try {
          setIsLoading(true);
          const history = await getPerformanceHistory(user.id);
          
          // Convert to activity items with proper type casting
          const activities: ActivityItem[] = history.map((item, index) => ({
            id: index + 1,
            type: 'quiz' as const, // Explicitly type as 'quiz'
            name: `${item.topic} Quiz`,
            score: `${item.score}/100`,
            date: item.date,
            topic: item.topic.split(' ')[0] // Just use the first word as shorthand
          }));
          
          setRecentActivities(activities);
        } catch (error) {
          console.error('Error fetching activities:', error);
          // Use mock data as fallback with proper typing
          setRecentActivities(mockRecentActivities);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchActivities();
  }, [user]);

  // Mock data as fallbacks with proper typing
  const mockRecentActivities: ActivityItem[] = [
    { id: 1, type: 'quiz', name: 'Data Structures Quiz', score: '8/10', date: '2025-04-10', topic: 'DSA' },
    { id: 2, type: 'resource', name: 'Database Normalization Article', date: '2025-04-08', topic: 'DBMS' },
    { id: 3, type: 'quiz', name: 'Operating Systems Quiz', score: '7/10', date: '2025-04-05', topic: 'OS' },
    { id: 4, type: 'resource', name: 'Algorithm Complexity Video', date: '2025-04-03', topic: 'DSA' },
  ];

  // Shared data for different tabs
  const sharedProps = {
    activities: recentActivities,
    isLoading,
    setActiveTab,
    user
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-darkBlue-900 via-darkBlue-800 to-darkBlue-700">
      <Navbar />
      <main className="flex-grow">
        {/* Welcome Section with new styling */}
        <WelcomeSection userName={user?.name || 'User'} />
        
        {/* Dashboard Tabs with updated styling */}
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
                <ProgressTab activities={recentActivities} />
              </TabsContent>
              
              <TabsContent value="resources" className="space-y-8 animate-fade-in-up">
                <ResourcesTab />
              </TabsContent>
              
              <TabsContent value="achievements" className="space-y-8 animate-fade-in-up">
                <AchievementsTab />
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;

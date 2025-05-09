
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from "@/components/ui/use-toast";
import { Layout, BarChart3, BookMarked, Trophy } from 'lucide-react';
import { getPerformanceHistory } from '@/services/performance/userPerformanceService';
import { getUserQuizResults } from '@/services/performance/quizResultsService';
import { useLocation } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';

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
  const [forceRefresh, setForceRefresh] = useState(false);
  const location = useLocation();
  const queryClient = useQueryClient();
  
  // Fetch both performance history and detailed quiz results
  const { data: activities, isLoading: activitiesLoading, refetch: refetchActivities } = useQuery({
    queryKey: ['userActivities', user?.id],
    queryFn: async () => {
      if (!user) return [];
      try {
        // Get historical performance data
        const history = await getPerformanceHistory(user.id);
        const historyActivities = history.map((item, index) => ({
          id: index + 1,
          type: 'quiz' as const,
          name: `${item.topic} Quiz`,
          score: `${item.score}/100`,
          date: item.date,
          topic: item.topic
        }));
        
        // Get detailed quiz results 
        const quizResults = await getUserQuizResults(user.id);
        const quizActivities = quizResults.map((result, index) => ({
          id: history.length + index + 1,
          type: 'quiz' as const,
          name: `${result.topic} Quiz`,
          score: `${result.score}/100`,
          date: result.submitted_at || new Date().toISOString(),
          topic: result.topic
        }));
        
        // Combine and deduplicate (prefer quiz results data if available)
        const combined = [...quizActivities, ...historyActivities];
        const seen = new Set();
        const unique = combined.filter(item => {
          const key = `${item.topic}-${item.date}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
        
        // Sort by date, most recent first
        return unique.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      } catch (error) {
        console.error('Error fetching activities:', error);
        return [];
      }
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Effect to handle refreshed data flag from location state after quiz submission
  useEffect(() => {
    if (location.state?.refreshData) {
      console.log('Refreshing dashboard data after quiz submission');
      
      // Invalidate all relevant queries
      const refreshQueries = async () => {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ['userPerformance'] }),
          queryClient.invalidateQueries({ queryKey: ['performanceHistory'] }),
          queryClient.invalidateQueries({ queryKey: ['quizResults'] }),
          queryClient.invalidateQueries({ queryKey: ['topicScores'] }),
          queryClient.invalidateQueries({ queryKey: ['aiRecommendations'] }),
          queryClient.invalidateQueries({ queryKey: ['userActivities'] }),
          queryClient.invalidateQueries({ queryKey: ['userBadges'] }),
        ]);
        
        // Trigger refetch
        await refetchActivities();
        
        // Trigger a force refresh for components
        setForceRefresh(prev => !prev);
      };
      
      refreshQueries();
      
      // If there's specific quiz completion data, show a toast
      if (location.state?.quizCompleted && location.state?.topic) {
        toast({
          title: "Quiz Results Updated",
          description: `Your ${location.state.topic} quiz has been recorded in your profile.`,
          variant: "default",
        });
      }
      
      // Clear the state to avoid unnecessary refreshes
      window.history.replaceState({}, document.title);
    }
  }, [location.state, queryClient, refetchActivities]);

  useEffect(() => {
    if (activities) {
      setRecentActivities(activities);
    }
  }, [activities]);

  useEffect(() => {
    // Only show welcome toast once per session
    const hasSeenWelcome = sessionStorage.getItem('hasSeenWelcome');
    if (!hasSeenWelcome && user) {
      setTimeout(() => {
        toast({
          title: `Welcome back, ${user.name}!`,
          description: "Your dashboard has been updated with new features.",
          variant: "default",
        });
        sessionStorage.setItem('hasSeenWelcome', 'true');
      }, 1000);
    }
  }, [user]);

  // Shared data for different tabs
  const sharedProps = {
    activities: recentActivities,
    isLoading: activitiesLoading,
    setActiveTab,
    user,
    forceRefresh
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
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;

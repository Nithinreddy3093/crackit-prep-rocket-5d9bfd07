import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from "@/components/ui/use-toast";

// Import refactored components
import WelcomeSection from '@/components/dashboard/WelcomeSection';
import RecentActivity, { ActivityItem } from '@/components/dashboard/RecentActivity';
import UpcomingQuizzes, { QuizItem } from '@/components/dashboard/UpcomingQuizzes';
import AiRecommendations from '@/components/dashboard/AiRecommendations';
import PopularTopics from '@/components/dashboard/PopularTopics';
import StudyStats, { PerformanceStat } from '@/components/dashboard/StudyStats';
import ActivityHistory from '@/components/dashboard/ActivityHistory';
import SavedResources, { SavedResource } from '@/components/dashboard/SavedResources';
import RecentlyViewed from '@/components/dashboard/RecentlyViewed';
import Certificates, { Certificate } from '@/components/dashboard/Certificates';
import Badges from '@/components/dashboard/Badges';
import { Video } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  // Helper function to show a welcome toast
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
  }, [user]);

  // Mock data
  const recentActivities: ActivityItem[] = [
    { id: 1, type: 'quiz', name: 'Data Structures Quiz', score: '8/10', date: '2025-04-10', topic: 'DSA' },
    { id: 2, type: 'resource', name: 'Database Normalization Article', date: '2025-04-08', topic: 'DBMS' },
    { id: 3, type: 'quiz', name: 'Operating Systems Quiz', score: '7/10', date: '2025-04-05', topic: 'OS' },
    { id: 4, type: 'resource', name: 'Algorithm Complexity Video', date: '2025-04-03', topic: 'DSA' },
  ];

  const upcomingQuizzes: QuizItem[] = [
    { id: 1, name: 'Advanced Data Structures', date: '2025-04-15', timeEstimate: '30 min' },
    { id: 2, name: 'SQL Query Optimization', date: '2025-04-18', timeEstimate: '25 min' },
    { id: 3, name: 'Process Scheduling Algorithms', date: '2025-04-20', timeEstimate: '20 min' },
  ];

  // Mock performance stats
  const performanceStats: PerformanceStat[] = [
    { topic: 'Data Structures', progress: 72, quizzesTaken: 5, averageScore: 84 },
    { topic: 'Algorithms', progress: 60, quizzesTaken: 3, averageScore: 78 },
    { topic: 'Databases', progress: 45, quizzesTaken: 2, averageScore: 65 },
    { topic: 'Operating Systems', progress: 30, quizzesTaken: 1, averageScore: 70 },
  ];
  
  // Mock certificates
  const certificates: Certificate[] = [
    { id: 1, name: 'Data Structures & Algorithms Proficiency', issueDate: '2025-03-20', score: '90%' },
    { id: 2, name: 'SQL & Database Management', issueDate: '2025-02-15', score: '85%' },
  ];

  // Mock saved resources
  const savedResources: SavedResource[] = [
    { id: 1, title: 'Database Normalization Explained', type: 'Video', topic: 'DBMS', savedOn: 'April 8, 2025', url: '#' },
    { id: 2, title: 'Advanced Algorithm Techniques', type: 'Article', topic: 'DSA', savedOn: 'April 5, 2025', url: '#' },
    { id: 3, title: 'Memory Management in OS', type: 'Course', topic: 'OS', savedOn: 'April 2, 2025', url: '#' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow">
        {/* Welcome Section */}
        <WelcomeSection userName={user?.name || 'User'} />
        
        {/* Dashboard Tabs */}
        <section className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4 w-full max-w-xl mx-auto mb-8">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="progress">Progress</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
                <TabsTrigger value="achievements">Achievements</TabsTrigger>
              </TabsList>
              
              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Recent Activity Card */}
                  <RecentActivity 
                    activities={recentActivities} 
                    onViewAllActivity={() => setActiveTab("progress")} 
                  />
                  
                  {/* Upcoming Quizzes Card */}
                  <UpcomingQuizzes quizzes={upcomingQuizzes} />
                </div>
                
                {/* AI Recommendations */}
                <AiRecommendations />

                {/* Popular Topics */}
                <PopularTopics />
              </TabsContent>
              
              {/* Progress Tab */}
              <TabsContent value="progress">
                <div className="space-y-8">
                  <StudyStats performanceStats={performanceStats} />
                  <ActivityHistory activities={recentActivities} />
                </div>
              </TabsContent>
              
              {/* Resources Tab */}
              <TabsContent value="resources">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-white">Your Learning Resources</h2>
                    <Button 
                      onClick={() => navigate('/resources')}
                      className="bg-primary hover:bg-primary/90 text-white"
                    >
                      Browse All Resources
                    </Button>
                  </div>
                  
                  <SavedResources resources={savedResources} />
                  <RecentlyViewed />
                </div>
              </TabsContent>
              
              {/* Achievements Tab */}
              <TabsContent value="achievements">
                <div className="space-y-8">
                  <Certificates certificates={certificates} />
                  <Badges />
                </div>
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

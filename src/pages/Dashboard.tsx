
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from "@/components/ui/use-toast";
import { Button } from '@/components/ui/button';
import { 
  BarChart3, BookOpen, Trophy, ListChecks, 
  Rocket, BookMarked, GraduationCap, Brain, 
  MousePointerClick, ArrowUpRight, Layout, BookOpenCheck
} from 'lucide-react';

// Import refactored components
import WelcomeSection from '@/components/dashboard/WelcomeSection';
import RecentActivity from '@/components/dashboard/RecentActivity';
import UpcomingQuizzes from '@/components/dashboard/UpcomingQuizzes';
import AiRecommendations from '@/components/dashboard/AiRecommendations';
import PopularTopics from '@/components/dashboard/PopularTopics';
import StudyStats from '@/components/dashboard/StudyStats';
import ActivityHistory from '@/components/dashboard/ActivityHistory';
import SavedResources from '@/components/dashboard/SavedResources';
import RecentlyViewed from '@/components/dashboard/RecentlyViewed';
import Certificates from '@/components/dashboard/Certificates';
import Badges from '@/components/dashboard/Badges';
import PerformanceSummary from '@/components/dashboard/PerformanceSummary';
import { getPerformanceHistory } from '@/services/supabasePerformanceService';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

    // Fetch real activity data
    const fetchActivities = async () => {
      if (user) {
        try {
          setIsLoading(true);
          const history = await getPerformanceHistory(user.id);
          
          // Convert to activity items
          const activities = history.map((item, index) => ({
            id: index + 1,
            type: 'quiz',
            name: `${item.topic} Quiz`,
            score: `${item.score}/100`,
            date: item.date,
            topic: item.topic.split(' ')[0] // Just use the first word as shorthand
          }));
          
          setRecentActivities(activities);
        } catch (error) {
          console.error('Error fetching activities:', error);
          // Use mock data as fallback
          setRecentActivities(mockRecentActivities);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchActivities();
  }, [user]);

  // Mock data as fallbacks
  const mockRecentActivities = [
    { id: 1, type: 'quiz', name: 'Data Structures Quiz', score: '8/10', date: '2025-04-10', topic: 'DSA' },
    { id: 2, type: 'resource', name: 'Database Normalization Article', date: '2025-04-08', topic: 'DBMS' },
    { id: 3, type: 'quiz', name: 'Operating Systems Quiz', score: '7/10', date: '2025-04-05', topic: 'OS' },
    { id: 4, type: 'resource', name: 'Algorithm Complexity Video', date: '2025-04-03', topic: 'DSA' },
  ];

  const upcomingQuizzes = [
    { id: 1, name: 'Advanced Data Structures', date: '2025-04-15', timeEstimate: '30 min' },
    { id: 2, name: 'SQL Query Optimization', date: '2025-04-18', timeEstimate: '25 min' },
    { id: 3, name: 'Process Scheduling Algorithms', date: '2025-04-20', timeEstimate: '20 min' },
  ];
  
  // Mock certificates
  const certificates = [
    { id: 1, name: 'Data Structures & Algorithms Proficiency', issueDate: '2025-03-20', score: '90%' },
    { id: 2, name: 'SQL & Database Management', issueDate: '2025-02-15', score: '85%' },
  ];

  // Mock saved resources
  const savedResources = [
    { id: 1, title: 'Database Normalization Explained', type: 'Video', topic: 'DBMS', savedOn: 'April 8, 2025', url: 'https://www.youtube.com/watch?v=UrYLYV7WSHM' },
    { id: 2, title: 'Advanced Algorithm Techniques', type: 'Article', topic: 'DSA', savedOn: 'April 5, 2025', url: 'https://www.geeksforgeeks.org/advanced-data-structures/' },
    { id: 3, title: 'Memory Management in OS', type: 'Course', topic: 'OS', savedOn: 'April 2, 2025', url: 'https://www.coursera.org/learn/operating-systems' },
  ];

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
              
              {/* Tab contents with glass-card styling */}
              <TabsContent value="overview" className="space-y-8 animate-fade-in-up">
                {/* Performance Summary (new component) */}
                <PerformanceSummary />
              
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="glass-card p-6 hover:shadow-blue-500/10 dashboard-card-hover">
                    <h3 className="section-title">
                      <MousePointerClick className="section-icon" />
                      Recent Activity
                    </h3>
                    <RecentActivity 
                      activities={recentActivities} 
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
                          {isLoading ? '...' : (recentActivities.filter(a => a.type === 'quiz').length)}
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
                    <Brain className="section-icon" />
                    AI Recommendations
                  </h3>
                  <AiRecommendations />
                </div>

                <div className="glass-card p-6 hover:shadow-blue-500/10 dashboard-card-hover">
                  <h3 className="section-title">
                    <Rocket className="section-icon" />
                    Popular Topics
                  </h3>
                  <PopularTopics />
                </div>
              </TabsContent>
              
              {/* Progress Tab Content */}
              <TabsContent value="progress" className="space-y-8 animate-fade-in-up">
                <div className="glass-card p-6 hover:shadow-blue-500/10 dashboard-card-hover">
                  <h3 className="section-title">
                    <BarChart3 className="section-icon" />
                    Your Learning Progress
                  </h3>
                  <StudyStats />
                </div>
                <div className="glass-card p-6 hover:shadow-blue-500/10 dashboard-card-hover">
                  <h3 className="section-title">
                    <ListChecks className="section-icon" />
                    Activity Timeline
                  </h3>
                  <ActivityHistory activities={recentActivities} />
                </div>
                <div className="glass-card p-6 hover:shadow-blue-500/10 dashboard-card-hover">
                  <h3 className="section-title">
                    <BookOpenCheck className="section-icon" />
                    Recent Quiz Results
                  </h3>
                  <div className="space-y-4">
                    {recentActivities
                      .filter(activity => activity.type === 'quiz')
                      .map((quiz, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                          <div>
                            <h4 className="font-medium text-white">{quiz.name}</h4>
                            <p className="text-sm text-white/70">{quiz.date}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-primary">{quiz.score}</div>
                            <p className="text-xs text-white/70">{quiz.topic}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </TabsContent>
              
              {/* Resources Tab Content */}
              <TabsContent value="resources" className="space-y-8 animate-fade-in-up">
                <div className="glass-card p-6 hover:shadow-blue-500/10 dashboard-card-hover">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="section-title mb-0">
                      <BookOpen className="section-icon" />
                      Your Learning Resources
                    </h3>
                    <Button 
                      onClick={() => navigate('/resources')}
                      className="bg-primary hover:bg-primary/90 text-white"
                    >
                      Browse All Resources
                      <ArrowUpRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                  
                  <SavedResources resources={savedResources} />
                  <div className="mt-8">
                    <h3 className="section-title">
                      <MousePointerClick className="section-icon" />
                      Recently Viewed
                    </h3>
                    <RecentlyViewed />
                  </div>
                  
                  <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <h4 className="font-semibold text-white mb-2 flex items-center">
                      <Rocket className="h-4 w-4 mr-2 text-blue-400" />
                      Enhanced Learning Resources
                    </h4>
                    <p className="text-white/80 text-sm mb-3">
                      Explore these handpicked resources to accelerate your learning.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <a 
                        href="https://www.geeksforgeeks.org/data-structures/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                      >
                        <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center mr-3">
                          <BookOpen className="h-4 w-4 text-green-400" />
                        </div>
                        <div className="flex-1">
                          <h5 className="font-medium text-white text-sm">Data Structures</h5>
                          <p className="text-xs text-white/70">GeeksforGeeks Guide</p>
                        </div>
                      </a>
                      <a 
                        href="https://leetcode.com/list/xi4ci4ig/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                      >
                        <div className="h-8 w-8 rounded-full bg-orange-500/20 flex items-center justify-center mr-3">
                          <ListChecks className="h-4 w-4 text-orange-400" />
                        </div>
                        <div className="flex-1">
                          <h5 className="font-medium text-white text-sm">Blind 75 Problems</h5>
                          <p className="text-xs text-white/70">LeetCode Collection</p>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              {/* Achievements Tab Content */}
              <TabsContent value="achievements" className="space-y-8 animate-fade-in-up">
                <div className="glass-card p-6 hover:shadow-blue-500/10 dashboard-card-hover">
                  <h3 className="section-title">
                    <GraduationCap className="section-icon" />
                    Your Certificates
                  </h3>
                  <Certificates certificates={certificates} />
                </div>
                <div className="glass-card p-6 hover:shadow-blue-500/10 dashboard-card-hover">
                  <h3 className="section-title">
                    <Trophy className="section-icon" />
                    Your Badges
                  </h3>
                  <Badges />
                  
                  <div className="mt-8 text-center">
                    <div className="inline-block p-6 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl border border-white/10">
                      <h4 className="text-xl font-bold text-white mb-3">Ready for your next challenge?</h4>
                      <p className="text-white/70 mb-4">Take a quiz to earn more badges and improve your skills!</p>
                      <Button 
                        onClick={() => navigate('/topics')}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                      >
                        Explore Quiz Topics
                      </Button>
                    </div>
                  </div>
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

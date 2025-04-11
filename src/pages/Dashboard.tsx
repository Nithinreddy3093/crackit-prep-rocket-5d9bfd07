
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Button,
  buttonVariants 
} from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { 
  ArrowRight,
  Brain, 
  Code, 
  Database, 
  Cpu, 
  BookOpen, 
  Target,
  ListChecks,
  BarChart,
  Activity,
  Clock,
  Trophy,
  ExternalLink,
  FileText,
  Video
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from "@/components/ui/use-toast";

// Import the new components
import RecentActivity, { ActivityItem } from '@/components/dashboard/RecentActivity';
import UpcomingQuizzes, { QuizItem } from '@/components/dashboard/UpcomingQuizzes';
import AiRecommendations from '@/components/dashboard/AiRecommendations';
import PopularTopics from '@/components/dashboard/PopularTopics';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  // Helper function to show a welcome toast
  React.useEffect(() => {
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
  const performanceStats = [
    { topic: 'Data Structures', progress: 72, quizzesTaken: 5, averageScore: 84 },
    { topic: 'Algorithms', progress: 60, quizzesTaken: 3, averageScore: 78 },
    { topic: 'Databases', progress: 45, quizzesTaken: 2, averageScore: 65 },
    { topic: 'Operating Systems', progress: 30, quizzesTaken: 1, averageScore: 70 },
  ];
  
  // Mock certificates
  const certificates = [
    { id: 1, name: 'Data Structures & Algorithms Proficiency', issueDate: '2025-03-20', score: '90%' },
    { id: 2, name: 'SQL & Database Management', issueDate: '2025-02-15', score: '85%' },
  ];

  // Mock saved resources
  const savedResources = [
    { id: 1, title: 'Database Normalization Explained', type: 'Video', topic: 'DBMS', savedOn: 'April 8, 2025', url: '#' },
    { id: 2, title: 'Advanced Algorithm Techniques', type: 'Article', topic: 'DSA', savedOn: 'April 5, 2025', url: '#' },
    { id: 3, title: 'Memory Management in OS', type: 'Course', topic: 'OS', savedOn: 'April 2, 2025', url: '#' },
  ];

  // Handler for starting a study session
  const startStudySession = () => {
    toast({
      title: "Study Session Started",
      description: "Your focused study session has been initiated.",
      variant: "default",
    });
    // In a real app, this would redirect to a study session page or start a timer
    navigate('/topics');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow">
        {/* Welcome Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-darkBlue-900 to-darkBlue-800">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  Welcome back, {user?.name}!
                </h1>
                <p className="text-xl text-blue-100">
                  Track your progress, identify weaknesses, and improve your skills.
                </p>
              </div>
              <div className="mt-4 md:mt-0 flex gap-3">
                <Button 
                  onClick={startStudySession}
                  className="bg-primary hover:bg-primary/90 text-white"
                >
                  Start Study Session
                </Button>
                <Button 
                  onClick={() => navigate('/resources')}
                  variant="outline" 
                  className="border-blue-400 text-blue-300 hover:bg-blue-900/30"
                >
                  Browse Resources
                </Button>
              </div>
            </div>
          </div>
        </section>
        
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
                  <Card className="bg-darkBlue-800 border-darkBlue-700">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xl text-white">Your Performance</CardTitle>
                        <BarChart className="h-5 w-5 text-primary" />
                      </div>
                      <CardDescription className="text-gray-400">
                        Track your progress across different topics
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {performanceStats.map((stat, index) => (
                          <div key={index}>
                            <div className="flex justify-between items-center mb-2">
                              <p className="text-sm font-medium text-white">{stat.topic}</p>
                              <span className="text-sm text-gray-400">{stat.progress}%</span>
                            </div>
                            <div className="w-full bg-darkBlue-700 rounded-full h-2.5">
                              <div 
                                className="bg-primary h-2.5 rounded-full" 
                                style={{ width: `${stat.progress}%` }}
                              ></div>
                            </div>
                            <div className="flex justify-between mt-2 text-xs text-gray-400">
                              <span>Quizzes taken: {stat.quizzesTaken}</span>
                              <span>Avg. score: {stat.averageScore}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-darkBlue-800 border-darkBlue-700">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xl text-white">Activity History</CardTitle>
                        <Activity className="h-5 w-5 text-primary" />
                      </div>
                      <CardDescription className="text-gray-400">
                        Your recent quizzes and resource interactions
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow className="border-darkBlue-700">
                            <TableHead className="text-gray-300">Activity</TableHead>
                            <TableHead className="text-gray-300">Topic</TableHead>
                            <TableHead className="text-gray-300">Date</TableHead>
                            <TableHead className="text-gray-300 text-right">Result</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {recentActivities.map((activity) => (
                            <TableRow key={activity.id} className="border-darkBlue-700">
                              <TableCell className="font-medium text-white">
                                <div className="flex items-center">
                                  {activity.type === 'quiz' ? 
                                    <ListChecks className="h-4 w-4 text-primary mr-2" /> : 
                                    <BookOpen className="h-4 w-4 text-accent mr-2" />
                                  }
                                  {activity.name}
                                </div>
                              </TableCell>
                              <TableCell className="text-gray-300">{activity.topic}</TableCell>
                              <TableCell className="text-gray-300">{new Date(activity.date).toLocaleDateString()}</TableCell>
                              <TableCell className="text-right">
                                {activity.score ? (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-primary">
                                    {activity.score}
                                  </span>
                                ) : (
                                  <span className="text-gray-400">—</span>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="outline" 
                        className="w-full border-darkBlue-600 text-primary hover:bg-primary/10"
                        onClick={() => {
                          toast({
                            title: "Full History",
                            description: "Your complete activity history is being loaded.",
                            variant: "default",
                          });
                        }}
                      >
                        View Full History
                      </Button>
                    </CardFooter>
                  </Card>
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
                  
                  <Card className="bg-darkBlue-800 border-darkBlue-700">
                    <CardHeader>
                      <CardTitle className="text-xl text-white">Saved Resources</CardTitle>
                      <CardDescription className="text-gray-400">
                        Resources you've bookmarked for later
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-darkBlue-700">
                            <TableHead className="text-gray-300">Title</TableHead>
                            <TableHead className="text-gray-300">Type</TableHead>
                            <TableHead className="text-gray-300">Topic</TableHead>
                            <TableHead className="text-gray-300">Saved On</TableHead>
                            <TableHead className="text-gray-300 text-right">Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {savedResources.map(resource => (
                            <TableRow key={resource.id} className="border-darkBlue-700">
                              <TableCell className="font-medium text-white">{resource.title}</TableCell>
                              <TableCell className="text-gray-300">{resource.type}</TableCell>
                              <TableCell className="text-gray-300">{resource.topic}</TableCell>
                              <TableCell className="text-gray-300">{resource.savedOn}</TableCell>
                              <TableCell className="text-right">
                                <Button variant="ghost" size="sm" className="h-8 text-primary hover:bg-primary/10" asChild>
                                  <a href={resource.url} className="flex items-center" target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="h-4 w-4" />
                                  </a>
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                    <CardFooter className="border-t border-darkBlue-700 mt-2">
                      <Button 
                        variant="ghost" 
                        className="w-full text-primary hover:bg-darkBlue-700"
                        onClick={() => navigate('/resources')}
                      >
                        View All Saved Resources
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card className="bg-darkBlue-800 border-darkBlue-700">
                    <CardHeader>
                      <CardTitle className="text-xl text-white">Recently Viewed</CardTitle>
                      <CardDescription className="text-gray-400">
                        Resources you've recently accessed
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-start p-3 bg-darkBlue-700 rounded-lg hover:bg-darkBlue-600 transition-colors">
                          <div className="bg-primary/10 p-2 rounded-md mr-3">
                            <Video className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1">
                            <p className="text-white text-sm font-medium">SQL Query Optimization Techniques</p>
                            <p className="text-gray-400 text-xs mt-1">
                              Video • 22 minutes • Viewed yesterday
                            </p>
                          </div>
                          <Button size="sm" variant="ghost" className="h-8 text-primary hover:bg-primary/10" asChild>
                            <a href="#" className="flex items-center">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        </div>
                        <div className="flex items-start p-3 bg-darkBlue-700 rounded-lg hover:bg-darkBlue-600 transition-colors">
                          <div className="bg-primary/10 p-2 rounded-md mr-3">
                            <FileText className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1">
                            <p className="text-white text-sm font-medium">Balanced Trees: Complete Guide</p>
                            <p className="text-gray-400 text-xs mt-1">
                              Article • 15 min read • Viewed 2 days ago
                            </p>
                          </div>
                          <Button size="sm" variant="ghost" className="h-8 text-primary hover:bg-primary/10" asChild>
                            <a href="#" className="flex items-center">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              {/* Achievements Tab */}
              <TabsContent value="achievements">
                <div className="space-y-8">
                  <Card className="bg-darkBlue-800 border-darkBlue-700">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xl text-white">Certificates</CardTitle>
                        <Trophy className="h-5 w-5 text-primary" />
                      </div>
                      <CardDescription className="text-gray-400">
                        Your earned certifications
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {certificates.map((cert) => (
                          <div key={cert.id} className="flex items-start space-x-4 p-4 rounded-lg bg-darkBlue-700/50 border border-darkBlue-600">
                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                              <Trophy className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-white font-medium">{cert.name}</h3>
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-2">
                                <p className="text-gray-400 text-sm">
                                  Issued on {new Date(cert.issueDate).toLocaleDateString()}
                                </p>
                                <div className="mt-2 sm:mt-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-primary">
                                  Score: {cert.score}
                                </div>
                              </div>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 text-primary hover:bg-primary/10"
                              onClick={() => {
                                toast({
                                  title: "Certificate Details",
                                  description: `Viewing details for ${cert.name}`,
                                  variant: "default",
                                });
                              }}
                            >
                              View
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-darkBlue-800 border-darkBlue-700">
                    <CardHeader>
                      <CardTitle className="text-xl text-white">Badges & Achievements</CardTitle>
                      <CardDescription className="text-gray-400">
                        Recognition of your accomplishments
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 py-2">
                        <div className="flex flex-col items-center text-center">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-3">
                            <Code className="h-8 w-8 text-white" />
                          </div>
                          <p className="text-white text-sm font-medium">Algorithm Master</p>
                          <p className="text-gray-400 text-xs mt-1">March 2025</p>
                        </div>
                        <div className="flex flex-col items-center text-center">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mb-3 opacity-60">
                            <Database className="h-8 w-8 text-white" />
                          </div>
                          <p className="text-gray-400 text-sm font-medium">SQL Expert</p>
                          <p className="text-gray-400 text-xs mt-1">In progress</p>
                        </div>
                        <div className="flex flex-col items-center text-center">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mb-3 opacity-60">
                            <Cpu className="h-8 w-8 text-white" />
                          </div>
                          <p className="text-gray-400 text-sm font-medium">OS Specialist</p>
                          <p className="text-gray-400 text-xs mt-1">In progress</p>
                        </div>
                        <div className="flex flex-col items-center text-center">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mb-3 opacity-60">
                            <Brain className="h-8 w-8 text-white" />
                          </div>
                          <p className="text-gray-400 text-sm font-medium">AI Apprentice</p>
                          <p className="text-gray-400 text-xs mt-1">In progress</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
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

// Helper component for badges
const Badge = ({ children, className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default Dashboard;

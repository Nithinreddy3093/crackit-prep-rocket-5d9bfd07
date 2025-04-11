
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
  ExternalLink
} from 'lucide-react';
import TopicCard from '@/components/TopicCard';
import { cn } from '@/lib/utils';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  // Mock recent activities
  const recentActivities = [
    { id: 1, type: 'quiz', name: 'Data Structures Quiz', score: '8/10', date: '2025-04-10', topic: 'DSA' },
    { id: 2, type: 'resource', name: 'Database Normalization Article', date: '2025-04-08', topic: 'DBMS' },
    { id: 3, type: 'quiz', name: 'Operating Systems Quiz', score: '7/10', date: '2025-04-05', topic: 'OS' },
    { id: 4, type: 'resource', name: 'Algorithm Complexity Video', date: '2025-04-03', topic: 'DSA' },
  ];

  // Mock upcoming quizzes
  const upcomingQuizzes = [
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
                  onClick={() => navigate('/topics')}
                  className="bg-primary hover:bg-primary/90 text-white"
                >
                  Take a Quiz
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
                  <Card className="md:col-span-2 bg-darkBlue-800 border-darkBlue-700">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xl text-white">Recent Activity</CardTitle>
                        <Activity className="h-5 w-5 text-primary" />
                      </div>
                      <CardDescription className="text-gray-400">
                        Your latest quizzes and resources
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {recentActivities.map((activity) => (
                          <div key={activity.id} className="flex items-start space-x-4 p-3 rounded-lg bg-darkBlue-700/50 hover:bg-darkBlue-700 transition-colors">
                            <div className={cn(
                              "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center",
                              activity.type === 'quiz' ? "bg-primary/20" : "bg-accent/20"
                            )}>
                              {activity.type === 'quiz' ? 
                                <ListChecks className="h-5 w-5 text-primary" /> : 
                                <BookOpen className="h-5 w-5 text-accent" />
                              }
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-white truncate">
                                {activity.name}
                              </p>
                              <div className="flex items-center mt-1">
                                <Badge className="mr-2 text-xs bg-darkBlue-600 text-gray-300">
                                  {activity.topic}
                                </Badge>
                                <p className="text-xs text-gray-400">
                                  {new Date(activity.date).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            {activity.score && (
                              <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-primary">
                                {activity.score}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="ghost" 
                        className="w-full text-primary hover:bg-darkBlue-700"
                        onClick={() => setActiveTab("progress")}
                      >
                        View All Activity
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  {/* Upcoming Quizzes Card */}
                  <Card className="bg-darkBlue-800 border-darkBlue-700">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xl text-white">Upcoming Quizzes</CardTitle>
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <CardDescription className="text-gray-400">
                        Recommended for you
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {upcomingQuizzes.map((quiz) => (
                          <div key={quiz.id} className="p-3 rounded-lg bg-darkBlue-700/50 hover:bg-darkBlue-700 transition-colors">
                            <p className="text-sm font-medium text-white truncate">{quiz.name}</p>
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 text-gray-400 mr-1" />
                                <p className="text-xs text-gray-400">{quiz.timeEstimate}</p>
                              </div>
                              <Button size="sm" variant="ghost" className="h-7 text-primary hover:bg-primary/10">
                                Start
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="ghost" 
                        className="w-full text-primary hover:bg-darkBlue-700"
                        onClick={() => navigate('/topics')}
                      >
                        View All Topics
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
                
                {/* AI Recommendations */}
                <Card className="bg-darkBlue-800 border-darkBlue-700">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl text-white">AI Recommendations</CardTitle>
                      <Brain className="h-5 w-5 text-primary" />
                    </div>
                    <CardDescription className="text-gray-400">
                      Personalized based on your performance
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-5 rounded-xl bg-darkBlue-700/50 border border-darkBlue-600">
                        <div className="flex items-center mb-4">
                          <div className="bg-primary/10 p-3 rounded-lg mr-4">
                            <Target className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium text-white">Focus Areas</h3>
                            <p className="text-sm text-gray-400">Based on your quiz results</p>
                          </div>
                        </div>
                        <ul className="space-y-2 mb-4">
                          <li className="text-gray-300 text-sm flex items-center">
                            <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                            Database Normalization concepts need attention
                          </li>
                          <li className="text-gray-300 text-sm flex items-center">
                            <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                            Process Scheduling algorithms need review
                          </li>
                          <li className="text-gray-300 text-sm flex items-center">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                            Strong understanding of array and string algorithms
                          </li>
                        </ul>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full border-darkBlue-600 text-primary hover:bg-primary/10"
                        >
                          Start Focused Practice
                        </Button>
                      </div>
                      
                      <div className="p-5 rounded-xl bg-darkBlue-700/50 border border-darkBlue-600">
                        <div className="flex items-center mb-4">
                          <div className="bg-primary/10 p-3 rounded-lg mr-4">
                            <BookOpen className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium text-white">Recommended Resources</h3>
                            <p className="text-sm text-gray-400">Curated for your needs</p>
                          </div>
                        </div>
                        <div className="space-y-3 mb-4">
                          <div className="flex items-start p-3 bg-darkBlue-700 rounded-lg hover:bg-darkBlue-600 transition-colors">
                            <div className="flex-1">
                              <p className="text-white text-sm font-medium">Database Normalization Simplified</p>
                              <p className="text-gray-400 text-xs mt-1 flex items-center">
                                Video tutorial • 15 minutes
                              </p>
                            </div>
                            <Button size="sm" variant="ghost" className="h-8 text-primary hover:bg-primary/10" asChild>
                              <a href="#" className="flex items-center">
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </Button>
                          </div>
                          <div className="flex items-start p-3 bg-darkBlue-700 rounded-lg hover:bg-darkBlue-600 transition-colors">
                            <div className="flex-1">
                              <p className="text-white text-sm font-medium">OS Scheduling Algorithms Explained</p>
                              <p className="text-gray-400 text-xs mt-1 flex items-center">
                                Article • 8 min read
                              </p>
                            </div>
                            <Button size="sm" variant="ghost" className="h-8 text-primary hover:bg-primary/10" asChild>
                              <a href="#" className="flex items-center">
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </Button>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full border-darkBlue-600 text-primary hover:bg-primary/10"
                          onClick={() => navigate('/resources')}
                        >
                          View All Resources
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Popular Topics */}
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">Popular Topics</h2>
                    <Button 
                      onClick={() => navigate('/topics')}
                      variant="link" 
                      className="text-primary hover:text-primary/90 flex items-center"
                    >
                      View All
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <TopicCard
                      title="Data Structures & Algorithms"
                      icon={<Code className="w-6 h-6" />}
                      description="Arrays, Linked Lists, Trees, Graphs, Sorting and Searching Algorithms."
                      bgColor="bg-gradient-to-br from-darkBlue-700 to-darkBlue-600"
                      to="/topics/dsa"
                    />
                    <TopicCard
                      title="Database Management"
                      icon={<Database className="w-6 h-6" />}
                      description="SQL, Normalization, Transactions, RDBMS concepts and queries."
                      bgColor="bg-gradient-to-br from-blue-700 to-blue-600"
                      to="/topics/dbms"
                    />
                    <TopicCard
                      title="Operating Systems"
                      icon={<Cpu className="w-6 h-6" />}
                      description="Process Management, Memory Management, File Systems, Scheduling."
                      bgColor="bg-gradient-to-br from-darkBlue-800 to-blue-900"
                      to="/topics/os"
                    />
                  </div>
                </div>
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
                          <TableRow className="border-darkBlue-700">
                            <TableCell className="font-medium text-white">Database Normalization Explained</TableCell>
                            <TableCell className="text-gray-300">Video</TableCell>
                            <TableCell className="text-gray-300">DBMS</TableCell>
                            <TableCell className="text-gray-300">April 8, 2025</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm" className="h-8 text-primary hover:bg-primary/10" asChild>
                                <a href="#" className="flex items-center">
                                  <ExternalLink className="h-4 w-4" />
                                </a>
                              </Button>
                            </TableCell>
                          </TableRow>
                          <TableRow className="border-darkBlue-700">
                            <TableCell className="font-medium text-white">Advanced Algorithm Techniques</TableCell>
                            <TableCell className="text-gray-300">Article</TableCell>
                            <TableCell className="text-gray-300">DSA</TableCell>
                            <TableCell className="text-gray-300">April 5, 2025</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm" className="h-8 text-primary hover:bg-primary/10" asChild>
                                <a href="#" className="flex items-center">
                                  <ExternalLink className="h-4 w-4" />
                                </a>
                              </Button>
                            </TableCell>
                          </TableRow>
                          <TableRow className="border-darkBlue-700">
                            <TableCell className="font-medium text-white">Memory Management in OS</TableCell>
                            <TableCell className="text-gray-300">Course</TableCell>
                            <TableCell className="text-gray-300">OS</TableCell>
                            <TableCell className="text-gray-300">April 2, 2025</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm" className="h-8 text-primary hover:bg-primary/10" asChild>
                                <a href="#" className="flex items-center">
                                  <ExternalLink className="h-4 w-4" />
                                </a>
                              </Button>
                            </TableCell>
                          </TableRow>
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
                            <Button variant="ghost" size="sm" className="h-8 text-primary hover:bg-primary/10">
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

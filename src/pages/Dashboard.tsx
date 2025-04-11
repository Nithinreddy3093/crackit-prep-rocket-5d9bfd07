
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowRight, Brain, Code, Database, Cpu, BookOpen, Target } from 'lucide-react';
import TopicCard from '@/components/TopicCard';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow">
        {/* Welcome Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-darkBlue-900 to-darkBlue-800">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Welcome back, {user.name}!
              </h1>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                Test your knowledge, identify your weaknesses, and get personalized recommendations to improve your skills.
              </p>
            </div>
            
            <div className="bg-darkBlue-800/50 backdrop-blur-sm rounded-xl p-6 border border-darkBlue-700/50 max-w-4xl mx-auto">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-blue-300" />
                Start Your Learning Journey
              </h2>
              <p className="text-blue-100 mb-6">
                Take an assessment to get AI-powered feedback on your strengths and weaknesses. Our system will analyze your performance and suggest personalized resources to help you improve.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => navigate('/topics')}
                  className="bg-primary hover:bg-primary/90 text-white flex items-center"
                  size="lg"
                >
                  Start New Assessment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button 
                  onClick={() => navigate('/dashboard/history')}
                  variant="outline" 
                  className="border-blue-400 text-blue-300 hover:bg-blue-900/30"
                  size="lg"
                >
                  View Past Results
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Topics Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-foreground">Popular Topics</h2>
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
        </section>

        {/* Personalized Recommendations */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-darkBlue-900/30">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground">AI Recommendations</h2>
              <p className="text-muted-foreground mt-2">
                Based on your past performance, here are some resources to help you improve.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-card p-6 rounded-xl border border-border">
                <div className="flex items-center mb-4">
                  <div className="bg-primary/10 p-3 rounded-lg mr-4">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">Key Areas to Focus On</h3>
                    <p className="text-sm text-muted-foreground">Personalized improvement areas</p>
                  </div>
                </div>
                <ul className="space-y-2 mb-4">
                  <li className="text-muted-foreground text-sm flex items-center">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                    Take a quiz in Database Management to establish a baseline
                  </li>
                  <li className="text-muted-foreground text-sm flex items-center">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                    Review Operating Systems - Process Scheduling concepts
                  </li>
                  <li className="text-muted-foreground text-sm flex items-center">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                    Practice more Data Structure questions on Trees
                  </li>
                </ul>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full border-border text-primary hover:bg-primary/10"
                >
                  Start Focused Practice
                </Button>
              </div>
              
              <div className="bg-card p-6 rounded-xl border border-border">
                <div className="flex items-center mb-4">
                  <div className="bg-primary/10 p-3 rounded-lg mr-4">
                    <Brain className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">Learning Resources</h3>
                    <p className="text-sm text-muted-foreground">Curated materials to help you improve</p>
                  </div>
                </div>
                <div className="space-y-3 mb-4">
                  <div className="flex items-start p-3 bg-background rounded-lg hover:bg-muted transition-colors">
                    <div className="flex-1">
                      <p className="text-foreground text-sm font-medium">Advanced Data Structures Explained Simply</p>
                      <p className="text-muted-foreground text-xs mt-1 flex items-center">
                        Video tutorial • 15 minutes
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start p-3 bg-background rounded-lg hover:bg-muted transition-colors">
                    <div className="flex-1">
                      <p className="text-foreground text-sm font-medium">SQL Query Optimization Techniques</p>
                      <p className="text-muted-foreground text-xs mt-1 flex items-center">
                        Article • 8 min read
                      </p>
                    </div>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full border-border text-primary hover:bg-primary/10"
                >
                  View All Resources
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;

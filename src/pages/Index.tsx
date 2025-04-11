
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Brain,
  Rocket,
  LineChart,
  Code,
  Database,
  BarChart,
  Building,
  BookOpen,
  Lightbulb,
  Target,
  Cpu,
  PieChart,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TopicCard from '@/components/TopicCard';
import CompanyCard from '@/components/CompanyCard';
import FeatureCard from '@/components/FeatureCard';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-darkBlue-900 to-darkBlue-700 opacity-[0.15] dark:opacity-20"></div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="animate-fade-in-up">
              <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl">
                <span className="block">Know It.</span>
                <span className="block text-primary">Crack It.</span>
              </h1>
              <p className="mt-4 text-xl text-muted-foreground">
                Test your knowledge. Fix your weak spots. Learn smarter. Get job-ready.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => navigate(isAuthenticated ? '/dashboard' : '/signup')}
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white"
                >
                  {isAuthenticated ? 'Go to Dashboard' : 'Get Started — It\'s Free'}
                </Button>
                <Button
                  onClick={() => navigate('/topics')}
                  variant="outline"
                  size="lg"
                  className="border-primary text-primary hover:bg-primary/10"
                >
                  Explore Topics
                </Button>
              </div>
              <div className="mt-6 flex items-center">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={`w-8 h-8 rounded-full bg-darkBlue-${200 + i * 100} border-2 border-background flex items-center justify-center text-xs text-white font-bold`}>
                      {i}
                    </div>
                  ))}
                </div>
                <p className="ml-3 text-sm text-muted-foreground">
                  Joined by <span className="font-medium text-foreground">2,000+</span> learners
                </p>
              </div>
            </div>
            <div className="relative lg:pl-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="relative mx-auto w-full max-w-lg">
                <div className="absolute -right-4 top-0 h-72 w-72 bg-primary/20 dark:bg-primary/10 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-pulse-glow"></div>
                <div className="absolute -bottom-12 left-8 h-56 w-56 bg-blue-200 dark:bg-blue-900/40 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
                
                <div className="relative rounded-2xl bg-card shadow-lg overflow-hidden border border-border">
                  <div className="p-6 pb-0">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold text-foreground">Topic: Data Structures</h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400">
                        15 Questions
                      </span>
                    </div>
                    <div className="space-y-4">
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <h4 className="font-medium text-foreground text-sm">1. What is the time complexity of the quicksort algorithm in the worst case?</h4>
                        <div className="mt-3 space-y-2">
                          <div className="flex items-center">
                            <input type="radio" id="opt1" name="q1" className="h-4 w-4 text-primary border-border rounded" />
                            <label htmlFor="opt1" className="ml-2 text-sm text-muted-foreground">O(n)</label>
                          </div>
                          <div className="flex items-center">
                            <input type="radio" id="opt2" name="q1" className="h-4 w-4 text-primary border-border rounded" />
                            <label htmlFor="opt2" className="ml-2 text-sm text-muted-foreground">O(n log n)</label>
                          </div>
                          <div className="flex items-center">
                            <input type="radio" id="opt3" name="q1" className="h-4 w-4 text-primary border-border rounded" />
                            <label htmlFor="opt3" className="ml-2 text-sm text-muted-foreground">O(n²)</label>
                          </div>
                          <div className="flex items-center">
                            <input type="radio" id="opt4" name="q1" className="h-4 w-4 text-primary border-border rounded" />
                            <label htmlFor="opt4" className="ml-2 text-sm text-muted-foreground">O(n log n²)</label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-muted/20 mt-4 border-t border-border">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full" style={{ width: '40%' }}></div>
                        </div>
                        <span className="ml-2 text-xs text-muted-foreground">6/15</span>
                      </div>
                    </div>
                    <Button size="sm" className="bg-primary hover:bg-primary/90">
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Topics Section */}
      <section className="py-12 sm:py-16 bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Test Yourself in Popular Topics
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
              Choose from various technical and non-technical subjects to assess your knowledge and identify areas for improvement.
            </p>
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
            <TopicCard
              title="Aptitude & Reasoning"
              icon={<Brain className="w-6 h-6" />}
              description="Numerical Ability, Logical Reasoning, Verbal Ability, Data Interpretation."
              bgColor="bg-gradient-to-br from-amber-700 to-amber-600"
              to="/topics/aptitude"
            />
            <TopicCard
              title="Computer Networks"
              icon={<BarChart className="w-6 h-6" />}
              description="TCP/IP, OSI Model, Routing, Network Security, Protocols."
              bgColor="bg-gradient-to-br from-red-700 to-red-600"
              to="/topics/networks"
            />
            <TopicCard
              title="System Design"
              icon={<PieChart className="w-6 h-6" />}
              description="Architecture Patterns, Scalability, APIs, Database Design, Caching."
              bgColor="bg-gradient-to-br from-darkBlue-700 to-indigo-600"
              to="/topics/system-design"
            />
          </div>
          
          <div className="mt-10 text-center">
            <Link
              to="/topics"
              className="inline-flex items-center text-primary hover:text-primary/90 font-medium"
            >
              View all topics
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Companies Section */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:items-center lg:justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
                Practice by Company
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-3xl">
                Take tests modeled after specific companies' interview patterns to improve your chances of getting hired.
              </p>
            </div>
            <div className="mt-5 flex lg:mt-0">
              <Link
                to="/companies"
                className="inline-flex items-center rounded-md border border-primary bg-background px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10"
              >
                View all companies
                <ArrowRight className="ml-2 -mr-1 h-4 w-4" />
              </Link>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <CompanyCard
              name="Infosys"
              logo="/placeholder.svg"
              description="Technical aptitude & coding patterns as per Infosys' hiring process."
              to="/companies/infosys"
            />
            <CompanyCard
              name="TCS"
              logo="/placeholder.svg"
              description="TCS National Qualifier Test (NQT) style questions and practice tests."
              to="/companies/tcs"
            />
            <CompanyCard
              name="Wipro"
              logo="/placeholder.svg"
              description="Designed based on Wipro NLTH and other selection processes."
              to="/companies/wipro"
            />
            <CompanyCard
              name="Accenture"
              logo="/placeholder.svg"
              description="Technical, analytical and coding challenges based on Accenture's process."
              to="/companies/accenture"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 sm:py-16 bg-muted/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-darkBlue-900 to-darkBlue-700 opacity-[0.05] dark:opacity-10"></div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              How Crackit Works
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
              Our AI-powered platform analyzes your performance and provides personalized feedback to improve faster.
            </p>
          </div>
          
          <div className="relative">
            <div className="absolute left-1/2 -translate-x-1/2 h-full w-1 bg-primary/20"></div>
            
            <div className="relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
                <div className="md:text-right">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white font-bold absolute left-1/2 -translate-x-1/2 md:translate-y-5">1</div>
                  <div className="bg-card rounded-xl p-6 shadow-sm md:ml-5 relative border border-border">
                    <h3 className="text-xl font-bold text-foreground mb-2">Take a Quick Test</h3>
                    <p className="text-muted-foreground">Choose a topic or company and take a 10-15 question test focused on key concepts. Each test is personalized to your skill level.</p>
                  </div>
                </div>
                <div></div>
                
                <div></div>
                <div>
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white font-bold absolute left-1/2 -translate-x-1/2 md:translate-y-5">2</div>
                  <div className="bg-card rounded-xl p-6 shadow-sm md:mr-5 relative border border-border">
                    <h3 className="text-xl font-bold text-foreground mb-2">Get Detailed Feedback</h3>
                    <p className="text-muted-foreground">Receive AI-powered analysis of your performance, showing your strengths and highlighting specific weak areas that need improvement.</p>
                  </div>
                </div>
                
                <div className="md:text-right">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white font-bold absolute left-1/2 -translate-x-1/2 md:translate-y-5">3</div>
                  <div className="bg-card rounded-xl p-6 shadow-sm md:ml-5 relative border border-border">
                    <h3 className="text-xl font-bold text-foreground mb-2">Get Smart Recommendations</h3>
                    <p className="text-muted-foreground">Receive personalized learning materials from various sources like YouTube, GeeksforGeeks, and more, targeted specifically to your weak spots.</p>
                  </div>
                </div>
                <div></div>
                
                <div></div>
                <div>
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white font-bold absolute left-1/2 -translate-x-1/2 md:translate-y-5">4</div>
                  <div className="bg-card rounded-xl p-6 shadow-sm md:mr-5 relative border border-border">
                    <h3 className="text-xl font-bold text-foreground mb-2">Track Your Progress</h3>
                    <p className="text-muted-foreground">Take weekly re-tests to measure improvements. View your progress graphs and track your learning journey over time with the Crackit Journal.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Key Features
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
              Crackit offers a comprehensive approach to test preparation with features designed to accelerate your learning.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Target className="w-6 h-6" />}
              title="Targeted Testing"
              description="Specialized tests for various topics and companies, designed to match real interview patterns and challenges."
              highlight={true}
            />
            <FeatureCard
              icon={<Lightbulb className="w-6 h-6" />}
              title="AI Feedback Engine"
              description="Detailed analysis of your performance with specific insights into strengths and areas needing improvement."
            />
            <FeatureCard
              icon={<BookOpen className="w-6 h-6" />}
              title="Smart Recommendations"
              description="Personalized learning materials from trusted sources to help you focus exactly where you need to."
            />
            <FeatureCard
              icon={<LineChart className="w-6 h-6" />}
              title="Progress Tracking"
              description="Visual graphs and streak tracking to keep you motivated and measure your improvement over time."
            />
            <FeatureCard
              icon={<Building className="w-6 h-6" />}
              title="Job Description Analyzer"
              description="Paste any job listing and get a customized quiz based on the skills mentioned in the description."
            />
            <FeatureCard
              icon={<Rocket className="w-6 h-6" />}
              title="Crackit Journal"
              description="Auto-generated preparation log that tracks your learning journey and shows your progress."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-16 bg-gradient-to-br from-darkBlue-900 to-darkBlue-700">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Ready to crack your next interview?
            </h2>
            <p className="mt-4 text-xl text-blue-100">
              Join thousands of students and professionals who are already using Crackit to prepare smarter.
            </p>
            <div className="mt-8 flex justify-center gap-4 flex-col sm:flex-row">
              <Button
                onClick={() => navigate(isAuthenticated ? '/dashboard' : '/signup')}
                size="lg"
                className="bg-white text-darkBlue-700 hover:bg-gray-100"
              >
                {isAuthenticated ? 'Go to Dashboard' : 'Get Started for Free'}
              </Button>
              <Button
                onClick={() => navigate('/about')}
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-darkBlue-800"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;

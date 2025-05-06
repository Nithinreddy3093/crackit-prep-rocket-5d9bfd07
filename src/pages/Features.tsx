
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { 
  Zap, 
  Brain, 
  Star, 
  LineChart, 
  Clock, 
  CheckCircle, 
  BookOpen, 
  Trophy, 
  Layout, 
  Users, 
  PersonStanding,
  BarChart4
} from 'lucide-react';

const Features = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-darkBlue-900 via-darkBlue-800 to-darkBlue-700">
      <Navbar />
      
      <main className="container max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="mb-24">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              All the Tools You Need<br />to Master Technical Interviews
            </h1>
            <p className="text-blue-200 text-lg max-w-3xl mx-auto mb-8">
              Our comprehensive platform provides everything you need to prepare for technical interviews at top tech companies.
              From adaptive quizzes to AI-powered feedback, we've got you covered.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="px-8">
                <Link to="/signup">Get Started</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-primary/50 text-primary hover:bg-primary/10">
                <Link to="/pricing">View Pricing</Link>
              </Button>
            </div>
          </div>
          
          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Zap className="h-6 w-6 text-primary" />}
              title="Adaptive Learning"
              description="Personalized quizzes that adapt to your skill level and learning progress."
            />
            <FeatureCard
              icon={<Brain className="h-6 w-6 text-primary" />}
              title="AI-Powered Feedback"
              description="Get intelligent recommendations based on your performance patterns."
            />
            <FeatureCard
              icon={<LineChart className="h-6 w-6 text-primary" />}
              title="Detailed Analytics"
              description="Track your progress with comprehensive performance metrics and visualizations."
            />
          </div>
        </section>
        
        {/* Core Features Section */}
        <section className="mb-24">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Core Features</h2>
          
          <div className="space-y-24">
            {/* Feature 1 */}
            <FeatureRow 
              title="Smart Quiz System"
              description="Our adaptive quiz engine tailors questions to your skill level, focusing on areas where you need improvement. With thousands of expertly crafted questions across all major technical topics, you'll be well-prepared for any interview scenario."
              icon={<Star className="h-12 w-12 text-primary" />}
              features={[
                "Adaptive difficulty levels",
                "Topic-specific quizzes",
                "Timed practice sessions",
                "Detailed explanations for each answer"
              ]}
              imageUrl="https://placehold.co/600x400/1e3a8a/ffffff?text=Adaptive+Quiz+System"
              imageSide="right"
            />
            
            {/* Feature 2 */}
            <FeatureRow 
              title="AI Performance Analysis"
              description="Our advanced AI analyzes your quiz performance to identify patterns, strengths, and weaknesses. The system provides personalized recommendations to help you focus your study efforts where they'll have the most impact."
              icon={<Brain className="h-12 w-12 text-primary" />}
              features={[
                "Pattern recognition in quiz performance",
                "Personalized study recommendations",
                "Skill gap identification",
                "Learning path optimization"
              ]}
              imageUrl="https://placehold.co/600x400/1e3a8a/ffffff?text=AI+Performance+Analysis"
              imageSide="left"
            />
            
            {/* Feature 3 */}
            <FeatureRow 
              title="Comprehensive Dashboard"
              description="Track your progress with our intuitive dashboard featuring detailed analytics, performance metrics, and progress tracking. See how you stack up against others and identify areas for improvement at a glance."
              icon={<BarChart4 className="h-12 w-12 text-primary" />}
              features={[
                "Visual progress tracking",
                "Performance comparison over time",
                "Topic mastery indicators",
                "Comprehensive statistics"
              ]}
              imageUrl="https://placehold.co/600x400/1e3a8a/ffffff?text=Performance+Dashboard"
              imageSide="right"
            />
            
            {/* Feature 4 */}
            <FeatureRow 
              title="Company-Specific Preparation"
              description="Prepare for interviews at specific companies with our tailored preparation modules. Each module focuses on the types of questions and topics frequently asked by particular companies."
              icon={<PersonStanding className="h-12 w-12 text-primary" />}
              features={[
                "Company-specific question sets",
                "Interview format simulation",
                "Inside tips from previous candidates",
                "Customized preparation plans"
              ]}
              imageUrl="https://placehold.co/600x400/1e3a8a/ffffff?text=Company+Preparation"
              imageSide="left"
            />
          </div>
        </section>
        
        {/* Additional Features */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">More Powerful Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AdditionalFeatureCard 
              icon={<BookOpen className="h-6 w-6 text-primary" />}
              title="Study Guides"
              description="Comprehensive guides covering all major technical topics with in-depth explanations and examples."
            />
            <AdditionalFeatureCard 
              icon={<Clock className="h-6 w-6 text-primary" />}
              title="Timed Practice"
              description="Simulate real interview conditions with timed practice sessions to improve speed and accuracy."
            />
            <AdditionalFeatureCard 
              icon={<CheckCircle className="h-6 w-6 text-primary" />}
              title="Progress Tracking"
              description="Monitor your improvement over time with detailed performance metrics and progress indicators."
            />
            <AdditionalFeatureCard 
              icon={<Users className="h-6 w-6 text-primary" />}
              title="Community Support"
              description="Connect with fellow learners to share tips, strategies, and encouragement."
            />
            <AdditionalFeatureCard 
              icon={<Layout className="h-6 w-6 text-primary" />}
              title="Customizable Dashboard"
              description="Personalize your learning dashboard to focus on the metrics that matter most to you."
            />
            <AdditionalFeatureCard 
              icon={<Trophy className="h-6 w-6 text-primary" />}
              title="Achievements & Badges"
              description="Stay motivated with gamified elements that reward your progress and milestones."
            />
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Ready to Accelerate Your Interview Prep?</h2>
          <p className="text-white/90 max-w-2xl mx-auto mb-8">
            Join thousands of engineers who have landed their dream jobs at top tech companies using our platform.
            Start your journey today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" variant="secondary" className="px-8">
              <Link to="/signup">Get Started for Free</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
              <Link to="/pricing">View Pricing Plans</Link>
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="bg-darkBlue-800/50 backdrop-blur-sm border border-darkBlue-700 rounded-xl p-6 hover:border-primary/30 transition-all">
      <div className="bg-primary/10 p-3 rounded-lg inline-flex mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  );
};

interface FeatureRowProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  imageUrl: string;
  imageSide: 'left' | 'right';
}

const FeatureRow: React.FC<FeatureRowProps> = ({ 
  title, 
  description, 
  icon, 
  features, 
  imageUrl, 
  imageSide 
}) => {
  const contentOrder = imageSide === 'left' ? 'order-2' : 'order-1';
  const imageOrder = imageSide === 'left' ? 'order-1' : 'order-2';
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <div className={`${contentOrder}`}>
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-primary/10 p-3 rounded-full">
            {icon}
          </div>
          <h3 className="text-2xl font-bold text-white">{title}</h3>
        </div>
        
        <p className="text-gray-300 text-lg mb-6">{description}</p>
        
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center text-gray-300">
              <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
              {feature}
            </li>
          ))}
        </ul>
        
        <div className="mt-8">
          <Button asChild>
            <Link to="/signup">Try This Feature</Link>
          </Button>
        </div>
      </div>
      
      <div className={`${imageOrder}`}>
        <img 
          src={imageUrl} 
          alt={title} 
          className="rounded-xl shadow-lg border border-darkBlue-700 w-full"
        />
      </div>
    </div>
  );
};

interface AdditionalFeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const AdditionalFeatureCard: React.FC<AdditionalFeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="bg-darkBlue-800/50 backdrop-blur-sm border border-darkBlue-700 rounded-xl p-6 hover:border-primary/30 transition-all">
      <div className="flex items-start">
        <div className="bg-primary/10 p-3 rounded-lg mr-4">
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
          <p className="text-gray-300">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default Features;


import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import QuizPreview from './QuizPreview';

const HeroSection = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
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
                onClick={() => navigate(isAuthenticated ? '/dashboard' : '/login')}
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
            <QuizPreview />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

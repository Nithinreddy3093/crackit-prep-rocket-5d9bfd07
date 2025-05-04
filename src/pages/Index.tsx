
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/home/HeroSection';
import TopicsSection from '@/components/home/TopicsSection';
import CompaniesSection from '@/components/home/CompaniesSection';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <HeroSection />
      <TopicsSection />
      <CompaniesSection />

      {/* Quiz CTA Section */}
      <section className="py-12 sm:py-16 bg-white dark:bg-darkBlue-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Test Your Knowledge with AI-Powered Quizzes
            </h2>
            <p className="mt-4 text-xl text-muted-foreground">
              Answer questions on multiple CS topics and get personalized AI feedback on your strengths and weaknesses.
            </p>
            <div className="mt-8 flex justify-center">
              <Button
                onClick={() => navigate(isAuthenticated ? '/topics' : '/login')}
                size="lg"
                className="bg-primary text-white hover:bg-primary/90"
              >
                Start Quiz Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
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

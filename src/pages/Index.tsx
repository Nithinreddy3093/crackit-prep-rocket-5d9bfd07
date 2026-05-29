import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/home/HeroSection';
import TopicsSection from '@/components/home/TopicsSection';
import CompaniesSection from '@/components/home/CompaniesSection';
import LogoAnimation from '@/components/LogoAnimation';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Sparkles, ArrowRight } from 'lucide-react';

const INTRO_KEY = 'crackit_intro_shown';

const Index = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showIntro, setShowIntro] = useState(() => {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem(INTRO_KEY) !== '1';
  });

  useEffect(() => {
    if (!showIntro) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [showIntro]);

  const handleIntroDone = () => {
    sessionStorage.setItem(INTRO_KEY, '1');
    setShowIntro(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {showIntro && <LogoAnimation onAnimationComplete={handleIntroDone} />}
      <Helmet>
        <title>CrackIt — AI-Powered Interview & UPSC Prep Platform</title>
        <meta name="description" content="Crack technical interviews and UPSC exams with AI-driven quizzes, company-specific practice questions, and personalized performance insights." />
        <link rel="canonical" href="https://crackit-prep-rocket.lovable.app/" />
        <meta property="og:title" content="CrackIt — AI-Powered Interview & UPSC Prep" />
        <meta property="og:description" content="Test your knowledge, fix weak spots, and get job-ready with AI-driven quizzes." />
        <meta property="og:url" content="https://crackit-prep-rocket.lovable.app/" />
        <meta property="og:type" content="website" />
      </Helmet>
      <Navbar />
      <HeroSection />
      <TopicsSection />
      <CompaniesSection />

      {/* Unified premium CTA — calmer than the previous two stacked sections */}
      <section className="relative py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-grid-soft opacity-40" />
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[420px] w-[820px] rounded-full bg-primary/15 blur-3xl" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl glass-strong p-10 sm:p-14 text-center overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary-glow">
              <Sparkles className="h-3.5 w-3.5" />
              Ready when you are
            </div>
            <h2 className="mt-5 font-display text-3xl sm:text-5xl font-bold tracking-tight text-foreground">
              Crack your next interview <br className="hidden sm:block" />
              with an <span className="gradient-text">AI co-pilot</span>.
            </h2>
            <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Personalized study plans, instant feedback, and company-specific
              practice — designed to make every minute of prep count.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
              <Button
                size="lg"
                variant="premium"
                onClick={() => navigate(isAuthenticated ? '/dashboard' : '/signup')}
              >
                {isAuthenticated ? 'Open Dashboard' : 'Get Started Free'}
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/about')}
              >
                Why CrackIt
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

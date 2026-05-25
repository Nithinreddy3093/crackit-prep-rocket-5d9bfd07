import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowRight, Sparkles, Zap } from 'lucide-react';
import QuizPreview from './QuizPreview';
import TypewriterHeadline from '@/components/common/TypewriterHeadline';

const HeroSection = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-hero-gradient" />
      <div className="absolute inset-0 bg-grid-soft opacity-60" />
      <div className="absolute inset-0 bg-aurora" />
      <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-[520px] w-[520px] rounded-full bg-primary/20 blur-3xl animate-float-slow" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-20 sm:pb-28">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16 items-center">
          <div className="lg:col-span-7 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary-glow">
              <Sparkles className="h-3.5 w-3.5" />
              AI-powered prep, refined for 2026
            </div>

            <h1 className="mt-6 font-display text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-foreground leading-[1.05]">
              <span className="block text-foreground/90">Know it.</span>
              <span className="block min-h-[1.1em]">
                <TypewriterHeadline
                  words={['Crack it.', 'Ace it.', 'Own it.', 'AI-level it.']}
                />
              </span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-xl leading-relaxed">
              Test your knowledge. Fix your weak spots. Get a personalized,
              AI-graded path to interviews and UPSC — without the noise.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => navigate(isAuthenticated ? '/dashboard' : '/signup')}
                size="lg"
                variant="premium"
              >
                <Sparkles className="h-4 w-4" />
                {isAuthenticated ? 'Open Dashboard' : 'Start Free — Get AI Plan'}
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => navigate('/topics')}
                size="lg"
                variant="outline"
              >
                Explore Topics
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-7 h-7 rounded-full ring-2 ring-background bg-gradient-indigo flex items-center justify-center text-[10px] font-semibold text-primary-foreground"
                    style={{ filter: `hue-rotate(${i * 18}deg)` }}
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <span>
                Joined by <span className="font-medium text-foreground">2,000+</span> learners
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-primary-glow" />
                <span>10,000+ AI-graded questions</span>
              </span>
            </div>
          </div>

          <div className="lg:col-span-5 lg:pl-4 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
            <QuizPreview />
          </div>
        </div>
      </div>

      {/* Bottom hairline glow */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
    </section>
  );
};

export default HeroSection;

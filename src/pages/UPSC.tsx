import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Award, 
  TrendingUp, 
  ArrowRight,
  Target,
  FileText,
  Users,
  Trophy,
  GraduationCap
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import ExamOverviewCard from '@/components/upsc/ExamOverviewCard';
import SubjectCard from '@/components/upsc/SubjectCard';
import StatsSection from '@/components/upsc/StatsSection';
import ImportantDates from '@/components/upsc/ImportantDates';
import EligibilityCriteria from '@/components/upsc/EligibilityCriteria';
import UPSCQuickActions from '@/components/upsc/UPSCQuickActions';
import UPSCProgressDashboard from '@/components/upsc/UPSCProgressDashboard';
import PreviousYearCutoffs from '@/components/upsc/PreviousYearCutoffs';
import PreparationStrategy from '@/components/upsc/PreparationStrategy';
import WhyCrackIt from '@/components/upsc/WhyCrackIt';
import { UPSC_SUBJECTS } from '@/data/upscData';
import { useAuth } from '@/contexts/AuthContext';
import { useUPSCProgress } from '@/hooks/useUPSCProgress';

const UPSC: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: upscProgress } = useUPSCProgress();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow pb-24 md:pb-0">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-10 md:py-16 lg:py-24">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-background to-green-500/10" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0icmdiYSgxNTEsIDEwNSwgNjIsIDAuMSkiLz48L2c+PC9zdmc+')] opacity-40" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <Badge className="mb-4 md:mb-6 bg-gradient-to-r from-orange-500/20 to-green-500/20 border-orange-500/30 text-foreground">
                <GraduationCap className="h-3 w-3 mr-1 text-orange-500" />
                UPSC Civil Services 2026
              </Badge>
              
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 md:mb-6">
                Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-green-500">UPSC</span> Journey
                <br className="hidden sm:block" />
                <span className="sm:hidden"> </span>Starts Here
              </h1>
              
              <p className="text-base md:text-xl text-muted-foreground max-w-3xl mx-auto mb-6 md:mb-8 px-2">
                10,000+ curated questions, PYQ analysis, AI-powered weak-area detection, 
                and stage-wise strategy — everything you need to clear the toughest exam in India.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center px-4 sm:px-0">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg h-11 md:h-12"
                  onClick={() => navigate('/quiz/upsc-polity')}
                >
                  <Target className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                  Start Prelims Practice
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-11 md:h-12"
                  onClick={() => document.getElementById('subjects')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <BookOpen className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                  Explore Syllabus
                </Button>
              </div>
              
              {/* Animated Counter Stats */}
              <div className="flex flex-wrap justify-center gap-6 md:gap-12 mt-8 md:mt-14 px-2">
                {[
                  { value: '10K+', label: 'Questions', icon: FileText },
                  { value: '9', label: 'Subjects', icon: BookOpen },
                  { value: '13L+', label: 'Aspirants in India', icon: Users },
                  { value: '0.08%', label: 'Selection Rate', icon: Award },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-green-400">
                      {item.value}
                    </div>
                    <div className="text-xs md:text-sm text-muted-foreground mt-1 flex items-center gap-1 justify-center">
                      <item.icon className="h-3 w-3" />
                      {item.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="py-6 md:py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-4 md:mb-6">
              <h2 className="text-lg md:text-xl font-bold text-foreground">Quick Start</h2>
              <p className="text-xs md:text-sm text-muted-foreground">Jump right into practice</p>
            </motion.div>
            <UPSCQuickActions />
          </div>
        </section>

        {/* Progress Dashboard (logged-in) */}
        {user && (
          <section className="py-6 md:py-8 px-4 sm:px-6 lg:px-8 bg-muted/30">
            <div className="max-w-7xl mx-auto">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-4 md:mb-6">
                <h2 className="text-lg md:text-xl font-bold text-foreground">Your Progress</h2>
                <p className="text-xs md:text-sm text-muted-foreground">Track your preparation journey</p>
              </motion.div>
              <UPSCProgressDashboard 
                userName={user.name || 'Aspirant'}
                overallProgress={upscProgress.overallProgress}
                subjectProgress={upscProgress.subjectProgress}
                questionsToday={upscProgress.questionsToday}
                streak={upscProgress.streak}
              />
            </div>
          </section>
        )}

        {/* Why CrackIt */}
        <WhyCrackIt />

        {/* Stats */}
        <section className="py-8 md:py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <StatsSection />
          </div>
        </section>

        {/* Preparation Strategy */}
        <PreparationStrategy />

        {/* Exam Overview */}
        <section className="py-10 md:py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-8 md:mb-12">
              <Badge className="mb-3 md:mb-4" variant="outline">
                <TrendingUp className="h-3 w-3 mr-1" />
                Exam Structure
              </Badge>
              <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-3 md:mb-4">UPSC Civil Services Journey</h2>
              <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
                The three-stage examination process that tests your knowledge, analytical ability, and personality.
              </p>
            </motion.div>
            <ExamOverviewCard />
          </div>
        </section>

        {/* Subjects */}
        <section id="subjects" className="py-10 md:py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-6 md:mb-12">
              <Badge className="mb-3 md:mb-4" variant="outline">
                <BookOpen className="h-3 w-3 mr-1" />
                Practice Topics
              </Badge>
              <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-3 md:mb-4">Master Every Subject</h2>
              <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
                Topic-wise practice with AI-generated questions covering the complete UPSC Prelims and Mains syllabus.
              </p>
            </motion.div>

            <div className="md:hidden">
              <ScrollArea className="w-full">
                <div className="flex gap-3 pb-4 px-1">
                  {UPSC_SUBJECTS.map((subject, index) => (
                    <SubjectCard key={subject.id} subject={subject} index={index} compact={true} />
                  ))}
                </div>
                <ScrollBar orientation="horizontal" className="invisible" />
              </ScrollArea>
            </div>
            
            <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6">
              {UPSC_SUBJECTS.map((subject, index) => (
                <SubjectCard key={subject.id} subject={subject} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* Cutoffs & Dates + Eligibility */}
        <section className="py-10 md:py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-3">Key Information</h2>
              <p className="text-sm md:text-base text-muted-foreground">Cutoffs, dates, and eligibility at a glance</p>
            </motion.div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
              <PreviousYearCutoffs />
              <ImportantDates />
            </div>
            <EligibilityCriteria />
          </div>
        </section>

        {/* Leaderboard CTA */}
        <section className="py-10 md:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-orange-600/90 to-green-700/90">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <Trophy className="h-10 w-10 text-yellow-300 mx-auto mb-4" />
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">UPSC Leaderboard</h2>
              <p className="text-sm md:text-base text-white/80 mb-6 md:mb-8">
                Compete with fellow aspirants and track your All-India rank
              </p>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 h-11 md:h-12" onClick={() => navigate('/leaderboard')}>
                <Trophy className="mr-2 h-4 w-4" />
                View Leaderboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-10 md:py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-orange-500 to-green-600 p-6 md:p-12 text-center">
              <div className="relative z-10">
                <h2 className="text-2xl md:text-4xl font-bold text-white mb-3 md:mb-4">Ready to Start Your UPSC Journey?</h2>
                <p className="text-white/90 text-sm md:text-lg mb-6 md:mb-8 max-w-2xl mx-auto">
                  Join thousands of aspirants who are using CrackIt to prepare smarter, not harder.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
                  <Button size="lg" className="bg-white text-orange-600 hover:bg-white/90 h-11 md:h-12" onClick={() => navigate('/quiz/upsc-polity')}>
                    Start Free Practice
                    <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                  </Button>
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 h-11 md:h-12" onClick={() => navigate('/pricing')}>
                    View Premium Plans
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default UPSC;

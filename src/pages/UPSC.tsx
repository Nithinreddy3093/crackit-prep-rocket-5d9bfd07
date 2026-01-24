import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Award, 
  TrendingUp, 
  ArrowRight,
  Sparkles,
  Target,
  FileText,
  Users
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ExamOverviewCard from '@/components/upsc/ExamOverviewCard';
import SubjectCard from '@/components/upsc/SubjectCard';
import StatsSection from '@/components/upsc/StatsSection';
import ImportantDates from '@/components/upsc/ImportantDates';
import EligibilityCriteria from '@/components/upsc/EligibilityCriteria';
import { UPSC_SUBJECTS } from '@/data/upscData';

const UPSC: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-16 md:py-24">
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-background to-green-500/10" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0icmdiYSgxNTEsIDEwNSwgNjIsIDAuMSkiLz48L2c+PC9zdmc+')] opacity-40" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              {/* Badge */}
              <Badge className="mb-6 bg-gradient-to-r from-orange-500/20 to-green-500/20 border-orange-500/30 text-foreground">
                <Sparkles className="h-3 w-3 mr-1 text-orange-500" />
                UPSC Civil Services Preparation
              </Badge>
              
              {/* Heading */}
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
                Crack <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-green-500">UPSC</span> with
                <br />AI-Powered Preparation
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Comprehensive study material, previous year questions, and personalized practice 
                to help you achieve your dream of becoming an IAS/IPS officer.
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg"
                  onClick={() => navigate('/quiz/upsc-polity')}
                >
                  <Target className="mr-2 h-5 w-5" />
                  Start Prelims Practice
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => document.getElementById('subjects')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <BookOpen className="mr-2 h-5 w-5" />
                  Explore Syllabus
                </Button>
              </div>
              
              {/* Quick Stats */}
              <div className="flex flex-wrap justify-center gap-8 mt-12">
                {[
                  { icon: FileText, label: '9 Subjects', value: 'GS + CSAT' },
                  { icon: Users, label: '10K+ Questions', value: 'PYQs Included' },
                  { icon: Award, label: 'AI Analysis', value: 'Personalized' }
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="flex items-center gap-3 text-muted-foreground"
                  >
                    <item.icon className="h-5 w-5 text-primary" />
                    <div className="text-left">
                      <div className="text-sm font-semibold text-foreground">{item.label}</div>
                      <div className="text-xs">{item.value}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <StatsSection />
          </div>
        </section>

        {/* Exam Overview Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <Badge className="mb-4" variant="outline">
                <TrendingUp className="h-3 w-3 mr-1" />
                Exam Structure
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                UPSC Civil Services Journey
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                The three-stage examination process that tests your knowledge, 
                analytical ability, and personality.
              </p>
            </motion.div>
            
            <ExamOverviewCard />
          </div>
        </section>

        {/* Subjects Grid Section */}
        <section id="subjects" className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <Badge className="mb-4" variant="outline">
                <BookOpen className="h-3 w-3 mr-1" />
                Practice Topics
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Master Every Subject
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Topic-wise practice with AI-generated questions covering the complete 
                UPSC Prelims and Mains syllabus.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {UPSC_SUBJECTS.map((subject, index) => (
                <SubjectCard key={subject.id} subject={subject} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* Info Section - Dates & Eligibility */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ImportantDates />
              <EligibilityCriteria />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 to-green-600 p-8 md:p-12 text-center"
            >
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iYSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVHJhbnNmb3JtPSJyb3RhdGUoNDUpIj48cGF0aCBkPSJNLTEwIDMwaDYwdjJoLTYweiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCBmaWxsPSJ1cmwoI2EpIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIi8+PC9zdmc+')] opacity-30" />
              
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Ready to Start Your UPSC Journey?
                </h2>
                <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
                  Join thousands of aspirants who are using CrackIt to prepare smarter, 
                  not harder. Get personalized study plans and AI-powered insights.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    className="bg-white text-orange-600 hover:bg-white/90"
                    onClick={() => navigate('/quiz/upsc-polity')}
                  >
                    Start Free Practice
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white/10"
                    onClick={() => navigate('/pricing')}
                  >
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

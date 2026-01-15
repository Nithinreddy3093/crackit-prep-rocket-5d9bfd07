import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Target, 
  ClipboardList, 
  BookOpen, 
  HelpCircle, 
  CheckSquare,
  TrendingUp,
  Building2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { companyData } from '@/data/companyData';
import CompanyHeroSection from './CompanyHeroSection';
import SelectionTimeline from './SelectionTimeline';
import TopicPriorityCard from './TopicPriorityCard';
import QuestionPatternCard from './QuestionPatternCard';
import EligibilityChecklist from './EligibilityChecklist';
import CompanyActionButtons from './CompanyActionButtons';
import PriorityBadge from './PriorityBadge';

interface SectionHeaderProps {
  icon: React.ElementType;
  title: string;
  subtitle?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ icon: Icon, title, subtitle }) => (
  <div className="flex items-center gap-3 mb-6">
    <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
      <Icon className="h-6 w-6" />
    </div>
    <div>
      <h2 className="text-xl lg:text-2xl font-bold text-foreground">{title}</h2>
      {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
    </div>
  </div>
);

const CompanyInfo = ({ companyName }: { companyName?: string }) => {
  const navigate = useNavigate();

  if (!companyName || !companyData[companyName]) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted/20 flex items-center justify-center">
              <Building2 className="h-10 w-10 text-muted-foreground" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Company Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The requested company information is not available. Please select a company from our list.
            </p>
            <Button onClick={() => navigate('/companies')} size="lg">
              Browse All Companies
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  const company = companyData[companyName];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <CompanyHeroSection company={company} />

      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - 2 columns */}
          <div className="lg:col-span-2 space-y-10">
            {/* Company Overview */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <SectionHeader
                icon={Target}
                title="Hiring Pattern"
                subtitle="What to expect from the recruitment process"
              />
              <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-5">
                <p className="text-muted-foreground leading-relaxed">
                  {company.hiringPattern}
                </p>
              </div>
            </motion.section>

            {/* Selection Process */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <SectionHeader
                icon={ClipboardList}
                title="Selection Process"
                subtitle="Step-by-step hiring flow"
              />
              <SelectionTimeline steps={company.process} />
            </motion.section>

            {/* Important Topics */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <SectionHeader
                icon={BookOpen}
                title="Important Topics"
                subtitle="Focus areas based on priority"
              />
              
              {/* Priority legend */}
              <div className="flex flex-wrap gap-3 mb-4">
                <PriorityBadge priority="high" size="sm" />
                <PriorityBadge priority="medium" size="sm" />
                <PriorityBadge priority="low" size="sm" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {company.topics.map((topic, index) => (
                  <TopicPriorityCard key={topic.name} topic={topic} index={index} />
                ))}
              </div>
            </motion.section>

            {/* Question Patterns */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <SectionHeader
                icon={HelpCircle}
                title="Question Patterns"
                subtitle="Common question types and frequency"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {company.questionPatterns.map((pattern, index) => (
                  <QuestionPatternCard key={pattern.type} pattern={pattern} index={index} />
                ))}
              </div>
            </motion.section>
          </div>

          {/* Sidebar - 1 column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Eligibility */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-xl p-5"
            >
              <SectionHeader
                icon={CheckSquare}
                title="Eligibility"
                subtitle="Check if you qualify"
              />
              <EligibilityChecklist
                requirements={company.requirements}
                specialConditions={company.specialConditions}
              />
            </motion.section>

            {/* Quick Stats */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-xl p-5"
            >
              <SectionHeader
                icon={TrendingUp}
                title="Quick Stats"
              />
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-border/30">
                  <span className="text-muted-foreground">Interview Rounds</span>
                  <span className="font-semibold">{company.process.length}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border/30">
                  <span className="text-muted-foreground">Topics to Cover</span>
                  <span className="font-semibold">{company.topics.length}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border/30">
                  <span className="text-muted-foreground">High Priority Topics</span>
                  <span className="font-semibold text-red-400">
                    {company.topics.filter(t => t.priority === 'high').length}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-muted-foreground">Avg. Salary</span>
                  <span className="font-semibold text-green-400">{company.averageSalary}</span>
                </div>
              </div>
            </motion.section>
          </div>
        </div>

        {/* Action Buttons */}
        <CompanyActionButtons company={company} companyName={companyName} />
      </div>
    </div>
  );
};

export default CompanyInfo;

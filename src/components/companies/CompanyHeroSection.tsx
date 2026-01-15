import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Briefcase, IndianRupee, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { CompanyData } from '@/data/companyData';

interface CompanyHeroSectionProps {
  company: CompanyData;
}

const difficultyConfig = {
  Easy: 'text-green-400 bg-green-500/20',
  Medium: 'text-yellow-400 bg-yellow-500/20',
  Hard: 'text-red-400 bg-red-500/20',
};

const CompanyHeroSection: React.FC<CompanyHeroSectionProps> = ({ company }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative container mx-auto px-4 py-8 lg:py-12">
        {/* Back button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/companies')}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          All Companies
        </Button>

        <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-8">
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="w-24 h-24 lg:w-32 lg:h-32 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 flex items-center justify-center text-5xl lg:text-6xl"
          >
            {company.logo}
          </motion.div>

          {/* Info */}
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.3 }}
            >
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
                {company.name}
              </h1>
              <p className="text-lg text-muted-foreground mb-4">{company.tagline}</p>

              {/* Stats */}
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-card/50 backdrop-blur-sm rounded-lg border border-border/50">
                  <IndianRupee className="h-4 w-4 text-green-400" />
                  <span className="text-sm font-medium">{company.averageSalary}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-card/50 backdrop-blur-sm rounded-lg border border-border/50">
                  <Briefcase className="h-4 w-4 text-blue-400" />
                  <span className="text-sm font-medium">{company.rolesOffered.length} Roles</span>
                </div>
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${difficultyConfig[company.difficulty]}`}>
                  <BarChart3 className="h-4 w-4" />
                  <span className="text-sm font-medium">{company.difficulty} Difficulty</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.3 }}
          className="mt-6 text-muted-foreground max-w-4xl leading-relaxed"
        >
          {company.description}
        </motion.p>
      </div>
    </motion.div>
  );
};

export default CompanyHeroSection;

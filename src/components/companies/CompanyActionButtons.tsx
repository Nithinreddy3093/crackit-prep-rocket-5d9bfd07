import React from 'react';
import { motion } from 'framer-motion';
import { Play, BookOpen, Share2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { CompanyData } from '@/data/companyData';

interface CompanyActionButtonsProps {
  company: CompanyData;
  companyName: string;
}

const CompanyActionButtons: React.FC<CompanyActionButtonsProps> = ({ company, companyName }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleStartPractice = () => {
    navigate(`/quiz/${company.quizTopicId}`);
  };

  const handleViewResources = () => {
    navigate('/resources');
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: `${company.name} Interview Preparation Guide`,
        text: `Check out this comprehensive interview prep guide for ${company.name}!`,
        url: window.location.href,
      });
    } catch {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: 'Link copied!',
        description: 'The link has been copied to your clipboard.',
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.3 }}
      className="sticky bottom-0 lg:relative bg-background/80 backdrop-blur-md border-t lg:border border-border/50 lg:rounded-xl p-4 lg:p-6 mt-8"
    >
      <div className="container mx-auto lg:p-0">
        <h3 className="text-lg font-semibold mb-4 hidden lg:block">Ready to Start?</h3>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            size="lg"
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
            onClick={handleStartPractice}
          >
            <Play className="h-5 w-5" />
            Start Practicing
          </Button>
          
          <Button
            size="lg"
            variant="outline"
            className="flex-1 gap-2"
            onClick={handleViewResources}
          >
            <BookOpen className="h-5 w-5" />
            View Resources
          </Button>

          <div className="flex gap-3 sm:flex-shrink-0">
            <Button
              size="lg"
              variant="ghost"
              className="flex-1 sm:flex-initial"
              onClick={handleShare}
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Roles offered */}
        <div className="mt-4 pt-4 border-t border-border/50">
          <p className="text-sm text-muted-foreground mb-2">Roles offered for freshers:</p>
          <div className="flex flex-wrap gap-2">
            {company.rolesOffered.map((role, index) => (
              <span
                key={index}
                className="text-sm px-3 py-1 bg-primary/10 text-primary rounded-full"
              >
                {role}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CompanyActionButtons;

import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Clock, HelpCircle, TrendingUp, ArrowRight, CheckCircle2 } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UPSCSubject } from '@/data/upscData';
import SubjectProgressRing from './SubjectProgressRing';

interface SubjectCardProps {
  subject: UPSCSubject;
  index: number;
  progress?: number;
  score?: number;
  compact?: boolean;
}

const SubjectCard: React.FC<SubjectCardProps> = ({ 
  subject, 
  index, 
  progress = 0,
  score,
  compact = false 
}) => {
  const navigate = useNavigate();
  
  // Dynamic icon component
  const IconComponent = (LucideIcons as any)[subject.icon] || LucideIcons.BookOpen;
  
  const weightageColors = {
    high: 'bg-green-500/10 text-green-500 border-green-500/30',
    medium: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30',
    low: 'bg-gray-500/10 text-gray-500 border-gray-500/30'
  };

  const handleStartQuiz = () => {
    navigate(`/quiz/${subject.id}`);
  };

  // Compact version for mobile carousel
  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        whileTap={{ scale: 0.98 }}
        transition={{ delay: index * 0.05 }}
        viewport={{ once: true }}
        onClick={handleStartQuiz}
        className="w-[160px] flex-shrink-0"
      >
        <Card className="relative overflow-hidden bg-card/80 backdrop-blur-sm border-border hover:border-primary/50 transition-all cursor-pointer p-4 h-full">
          <div className={`absolute inset-0 bg-gradient-to-br ${subject.color} opacity-5`} />
          
          <div className="relative">
            {/* Icon & Progress */}
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg bg-gradient-to-br ${subject.color} text-white`}>
                <IconComponent className="h-4 w-4" />
              </div>
              {progress > 0 && (
                <SubjectProgressRing progress={progress} size={32} strokeWidth={2.5} />
              )}
            </div>
            
            {/* Title */}
            <h4 className="font-semibold text-foreground text-sm mb-1 line-clamp-1">
              {subject.title.split('&')[0].trim()}
            </h4>
            
            {/* Stats */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-0.5">
                <HelpCircle className="h-3 w-3" />
                {subject.questionCount}
              </span>
              <span className="flex items-center gap-0.5">
                <Clock className="h-3 w-3" />
                {subject.timeLimit}m
              </span>
            </div>

            {/* Score Badge */}
            {score !== undefined && score > 0 && (
              <div className="mt-2">
                <Badge variant="outline" className="text-[10px] h-5 bg-primary/10 border-primary/30 text-primary">
                  <CheckCircle2 className="h-2.5 w-2.5 mr-0.5" />
                  {score}%
                </Badge>
              </div>
            )}
          </div>
        </Card>
      </motion.div>
    );
  }

  // Full card version
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <Card className="group relative overflow-hidden bg-card/80 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl h-full">
        {/* Gradient Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br ${subject.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
        
        <div className="p-4 md:p-6 relative">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 md:p-3 rounded-xl bg-gradient-to-br ${subject.color} text-white shadow-lg`}>
                <IconComponent className="h-5 w-5 md:h-6 md:w-6" />
              </div>
              {progress > 0 && (
                <SubjectProgressRing progress={progress} size={44} strokeWidth={3} />
              )}
            </div>
            <Badge className={`${weightageColors[subject.weightage]} border text-[10px] md:text-xs`}>
              <TrendingUp className="h-2.5 w-2.5 md:h-3 md:w-3 mr-0.5 md:mr-1" />
              {subject.weightage.charAt(0).toUpperCase() + subject.weightage.slice(1)}
            </Badge>
          </div>
          
          {/* Title & Description */}
          <h3 className="text-base md:text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
            {subject.title}
          </h3>
          <p className="text-xs md:text-sm text-muted-foreground mb-4 line-clamp-2">
            {subject.description}
          </p>
          
          {/* Stats */}
          <div className="flex items-center gap-4 text-xs md:text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1.5">
              <HelpCircle className="h-3.5 w-3.5 md:h-4 md:w-4" />
              <span>{subject.questionCount} Qs</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 md:h-4 md:w-4" />
              <span>{subject.timeLimit} mins</span>
            </div>
          </div>
          
          {/* Topics Preview - Hidden on small mobile */}
          <div className="mb-4 hidden sm:block">
            <div className="flex flex-wrap gap-1.5">
              {subject.topics.slice(0, 3).map((topic, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 text-[10px] md:text-xs rounded-full bg-muted text-muted-foreground"
                >
                  {topic}
                </span>
              ))}
              {subject.topics.length > 3 && (
                <span className="px-2 py-0.5 text-[10px] md:text-xs rounded-full bg-primary/10 text-primary">
                  +{subject.topics.length - 3} more
                </span>
              )}
            </div>
          </div>
          
          {/* CTA Button */}
          <Button
            onClick={handleStartQuiz}
            className="w-full group/btn h-9 md:h-10 text-sm"
            variant="outline"
          >
            Start Practice
            <ArrowRight className="ml-2 h-3.5 w-3.5 md:h-4 md:w-4 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default SubjectCard;
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Clock, HelpCircle, TrendingUp, ArrowRight } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UPSCSubject } from '@/data/upscData';

interface SubjectCardProps {
  subject: UPSCSubject;
  index: number;
}

const SubjectCard: React.FC<SubjectCardProps> = ({ subject, index }) => {
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
        
        <div className="p-6 relative">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-xl bg-gradient-to-br ${subject.color} text-white shadow-lg`}>
              <IconComponent className="h-6 w-6" />
            </div>
            <Badge className={`${weightageColors[subject.weightage]} border`}>
              <TrendingUp className="h-3 w-3 mr-1" />
              {subject.weightage.charAt(0).toUpperCase() + subject.weightage.slice(1)} Yield
            </Badge>
          </div>
          
          {/* Title & Description */}
          <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
            {subject.title}
          </h3>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {subject.description}
          </p>
          
          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1.5">
              <HelpCircle className="h-4 w-4" />
              <span>{subject.questionCount} Qs</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>{subject.timeLimit} mins</span>
            </div>
          </div>
          
          {/* Topics Preview */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-1.5">
              {subject.topics.slice(0, 3).map((topic, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 text-xs rounded-full bg-muted text-muted-foreground"
                >
                  {topic}
                </span>
              ))}
              {subject.topics.length > 3 && (
                <span className="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary">
                  +{subject.topics.length - 3} more
                </span>
              )}
            </div>
          </div>
          
          {/* CTA Button */}
          <Button
            onClick={handleStartQuiz}
            className="w-full group/btn"
            variant="outline"
          >
            Start Practice
            <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default SubjectCard;

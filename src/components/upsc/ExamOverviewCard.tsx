import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Clock, FileText, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { UPSC_EXAM_STAGES } from '@/data/upscData';

const ExamOverviewCard: React.FC = () => {
  const stageIcons = {
    prelims: FileText,
    mains: FileText,
    interview: CheckCircle
  };

  return (
    <div className="relative">
      {/* Connection Line */}
      <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20 transform -translate-y-1/2 hidden lg:block" />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
        {UPSC_EXAM_STAGES.map((stage, index) => {
          const Icon = stageIcons[stage.id as keyof typeof stageIcons] || FileText;
          
          return (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="relative p-6 bg-card/80 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-300 group h-full">
                {/* Stage Number Badge */}
                <div className="absolute -top-3 left-6 px-3 py-1 bg-primary text-primary-foreground text-sm font-bold rounded-full">
                  Stage {index + 1}
                </div>
                
                {/* Icon */}
                <div className="mt-4 mb-4 flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">{stage.title}</h3>
                </div>
                
                <p className="text-muted-foreground text-sm mb-4">
                  {stage.description}
                </p>
                
                {/* Duration */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <Clock className="h-4 w-4" />
                  <span>{stage.duration}</span>
                </div>
                
                {/* Papers */}
                <div className="space-y-2 mb-4">
                  <h4 className="text-sm font-semibold text-foreground">Papers:</h4>
                  <ul className="space-y-1">
                    {stage.papers.slice(0, 3).map((paper, i) => (
                      <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                        <ChevronRight className="h-3 w-3 mt-0.5 text-primary flex-shrink-0" />
                        <span>{paper}</span>
                      </li>
                    ))}
                    {stage.papers.length > 3 && (
                      <li className="text-xs text-primary cursor-pointer hover:underline">
                        +{stage.papers.length - 3} more papers
                      </li>
                    )}
                  </ul>
                </div>
                
                {/* Criteria */}
                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground italic">
                    {stage.passingCriteria}
                  </p>
                </div>
                
                {/* Arrow to next stage */}
                {index < UPSC_EXAM_STAGES.length - 1 && (
                  <div className="hidden lg:flex absolute -right-3 top-1/2 transform -translate-y-1/2 z-10">
                    <div className="p-2 rounded-full bg-primary text-primary-foreground shadow-lg">
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ExamOverviewCard;

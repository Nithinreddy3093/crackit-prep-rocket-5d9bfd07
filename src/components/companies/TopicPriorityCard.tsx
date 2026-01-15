import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import PriorityBadge from './PriorityBadge';
import { TopicWithPriority } from '@/data/companyData';

interface TopicPriorityCardProps {
  topic: TopicWithPriority;
  index: number;
}

const TopicPriorityCard: React.FC<TopicPriorityCardProps> = ({ topic, index }) => {
  const priorityWeight = {
    high: 90,
    medium: 60,
    low: 30,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="group bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-4 hover:border-primary/50 hover:bg-card/70 transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
              {topic.name}
            </h4>
            {topic.description && (
              <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                {topic.description}
              </p>
            )}
          </div>
        </div>
        <PriorityBadge priority={topic.priority} showLabel={false} size="sm" />
      </div>

      {/* Progress indicator */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
          <span>Recommended Focus</span>
          <span>{priorityWeight[topic.priority]}%</span>
        </div>
        <div className="h-1.5 bg-muted/30 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${priorityWeight[topic.priority]}%` }}
            transition={{ delay: index * 0.05 + 0.3, duration: 0.5 }}
            className={`h-full rounded-full ${
              topic.priority === 'high'
                ? 'bg-gradient-to-r from-red-500 to-orange-500'
                : topic.priority === 'medium'
                ? 'bg-gradient-to-r from-yellow-500 to-amber-500'
                : 'bg-gradient-to-r from-green-500 to-emerald-500'
            }`}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default TopicPriorityCard;

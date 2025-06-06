
import React, { memo } from 'react';
import { ArrowRight, CheckCircle2, Clock, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

interface TopicCardProps {
  title: string;
  icon: React.ReactNode;
  description: string;
  bgColor: string;
  to: string;
  questionCount?: number;
  timeEstimate?: string;
  completed?: number;
  onClick?: () => void;
  index?: number;
}

const TopicCard: React.FC<TopicCardProps> = ({
  title,
  icon,
  description,
  bgColor,
  to,
  questionCount = 15,
  timeEstimate = "15 min",
  completed = 0,
  onClick,
  index = 0
}) => {
  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        duration: 0.3,
        delay: index * 0.1 
      }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`topic-card group relative p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 h-full overflow-hidden cursor-pointer ${bgColor}`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="text-white bg-white/20 p-3 rounded-lg shadow-inner backdrop-blur-sm group-hover:bg-white/30 transition-colors duration-300">
            {icon}
          </div>
          <ArrowRight className="text-white/70 w-5 h-5 transform group-hover:translate-x-1 group-hover:text-white transition-all duration-300" />
        </div>
        
        <h3 className="text-xl font-semibold text-white group-hover:text-white/90 transition-colors mb-2">
          {title}
        </h3>
        <p className="text-white/80 text-sm line-clamp-2 mb-4 leading-relaxed">
          {description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-white/20 text-white backdrop-blur-sm">
            <BookOpen className="mr-1 h-3 w-3" />
            {questionCount} Questions
          </span>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-white/20 text-white backdrop-blur-sm">
            <Clock className="mr-1 h-3 w-3" />
            {timeEstimate}
          </span>
          {completed > 0 && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-400/30 backdrop-blur-sm text-white">
              <CheckCircle2 className="mr-1 h-3 w-3" />
              {completed}% Complete
            </span>
          )}
        </div>
        
        {completed > 0 && (
          <div className="mt-3">
            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
              <motion.div 
                className="bg-green-400 h-2 rounded-full" 
                initial={{ width: 0 }}
                animate={{ width: `${completed}%` }}
                transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default memo(TopicCard);

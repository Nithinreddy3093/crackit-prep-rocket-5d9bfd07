
import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

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
  onClick
}) => {
  return (
    <div 
      onClick={onClick}
      className={`topic-card group block p-6 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 h-full overflow-hidden cursor-pointer ${bgColor}`}
    >
      <div className="topic-card-content">
        <div className="flex items-center justify-between mb-2">
          <div className="text-white bg-white/20 p-3 rounded-lg shadow-inner backdrop-blur-sm">
            {icon}
          </div>
          <div className="flex items-center">
            <ArrowRight className="text-white/70 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
          </div>
        </div>
        
        <h3 className="mt-4 text-xl font-semibold text-white group-hover:text-white/90 transition-colors">{title}</h3>
        <p className="mt-2 text-white/80 text-sm line-clamp-3">{description}</p>
        
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/20 text-white backdrop-blur-sm">
            {questionCount} Questions
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/20 text-white backdrop-blur-sm">
            {timeEstimate}
          </span>
          {completed > 0 && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-400/30 backdrop-blur-sm text-white">
              <CheckCircle2 className="mr-1 h-3 w-3" />
              {completed}% Complete
            </span>
          )}
        </div>
        
        {completed > 0 && (
          <div className="mt-3">
            <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-green-400 h-1.5 rounded-full transition-all duration-500" 
                style={{ width: `${completed}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopicCard;

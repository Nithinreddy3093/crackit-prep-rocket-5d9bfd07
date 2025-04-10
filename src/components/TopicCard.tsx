
import React from 'react';
import { Link } from 'react-router-dom';
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
}

const TopicCard: React.FC<TopicCardProps> = ({
  title,
  icon,
  description,
  bgColor,
  to,
  questionCount = 15,
  timeEstimate = "15 min",
  completed = 0
}) => {
  return (
    <Link 
      to={to}
      className={`group block p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 ${bgColor} h-full`}
    >
      <div className="flex items-center justify-between">
        <div className="text-white bg-white/20 p-3 rounded-lg">
          {icon}
        </div>
        <ArrowRight className="text-white/70 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200" />
      </div>
      
      <h3 className="mt-4 text-xl font-semibold text-white">{title}</h3>
      <p className="mt-2 text-white/80 text-sm">{description}</p>
      
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/20 text-white">
          {questionCount} Questions
        </span>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/20 text-white">
          {timeEstimate}
        </span>
        {completed > 0 && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-400/30 text-white">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            {completed}% Complete
          </span>
        )}
      </div>
    </Link>
  );
};

export default TopicCard;

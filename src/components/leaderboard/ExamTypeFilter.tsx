import React from 'react';
import { motion } from 'framer-motion';
import { Code2, GraduationCap } from 'lucide-react';

type ExamType = 'all' | 'tech' | 'upsc';

interface ExamTypeFilterProps {
  value: ExamType;
  onChange: (value: ExamType) => void;
}

const ExamTypeFilter: React.FC<ExamTypeFilterProps> = ({ value, onChange }) => {
  const options: { value: ExamType; label: string; icon: React.ElementType }[] = [
    { value: 'all', label: 'All', icon: Code2 },
    { value: 'tech', label: 'Tech', icon: Code2 },
    { value: 'upsc', label: 'UPSC', icon: GraduationCap },
  ];

  return (
    <div className="flex items-center gap-1 p-1 bg-white/5 rounded-lg border border-white/10">
      {options.map((option) => {
        const Icon = option.icon;
        return (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`relative px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              value === option.value
                ? 'text-white'
                : 'text-white/60 hover:text-white/80'
            }`}
          >
            {value === option.value && (
              <motion.div
                layoutId="examTypeFilter"
                className="absolute inset-0 bg-primary rounded-md"
                initial={false}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1">
              <Icon className="h-3 w-3" />
              {option.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default ExamTypeFilter;
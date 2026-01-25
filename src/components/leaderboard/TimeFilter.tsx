import React from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

type TimeRange = 'weekly' | 'monthly' | 'all-time';

interface TimeFilterProps {
  value: TimeRange;
  onChange: (value: TimeRange) => void;
}

const TimeFilter: React.FC<TimeFilterProps> = ({ value, onChange }) => {
  const options: { value: TimeRange; label: string }[] = [
    { value: 'weekly', label: 'This Week' },
    { value: 'monthly', label: 'This Month' },
    { value: 'all-time', label: 'All Time' },
  ];

  return (
    <div className="flex items-center gap-1 p-1 bg-white/5 rounded-lg border border-white/10">
      {options.map((option) => (
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
              layoutId="timeFilter"
              className="absolute inset-0 bg-primary rounded-md"
              initial={false}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative z-10 flex items-center gap-1">
            {option.value === 'all-time' && <Clock className="h-3 w-3" />}
            {option.label}
          </span>
        </button>
      ))}
    </div>
  );
};

export default TimeFilter;
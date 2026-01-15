import React from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, TrendingUp, Minus, TrendingDown } from 'lucide-react';
import { QuestionPattern } from '@/data/companyData';

interface QuestionPatternCardProps {
  pattern: QuestionPattern;
  index: number;
}

const frequencyConfig = {
  common: {
    label: 'Very Common',
    icon: TrendingUp,
    className: 'text-green-400 bg-green-500/10',
    barWidth: '90%',
    barColor: 'bg-green-500',
  },
  occasional: {
    label: 'Sometimes Asked',
    icon: Minus,
    className: 'text-yellow-400 bg-yellow-500/10',
    barWidth: '50%',
    barColor: 'bg-yellow-500',
  },
  rare: {
    label: 'Rarely Asked',
    icon: TrendingDown,
    className: 'text-muted-foreground bg-muted/20',
    barWidth: '20%',
    barColor: 'bg-muted',
  },
};

const QuestionPatternCard: React.FC<QuestionPatternCardProps> = ({ pattern, index }) => {
  const config = frequencyConfig[pattern.frequency];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-4"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-primary" />
          <h4 className="font-medium text-foreground">{pattern.type}</h4>
        </div>
        <span className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${config.className}`}>
          <Icon className="h-3 w-3" />
          {config.label}
        </span>
      </div>

      {/* Frequency bar */}
      <div className="mb-3">
        <div className="h-1 bg-muted/30 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: config.barWidth }}
            transition={{ delay: index * 0.05 + 0.3, duration: 0.5 }}
            className={`h-full rounded-full ${config.barColor}`}
          />
        </div>
      </div>

      {/* Examples */}
      <div className="flex flex-wrap gap-1.5">
        {pattern.examples.slice(0, 4).map((example, i) => (
          <span
            key={i}
            className="text-xs px-2 py-1 bg-muted/30 text-muted-foreground rounded-md"
          >
            {example}
          </span>
        ))}
      </div>
    </motion.div>
  );
};

export default QuestionPatternCard;

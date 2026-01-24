import React from 'react';
import { motion } from 'framer-motion';
import { Users, Target, GraduationCap, Calendar } from 'lucide-react';
import { UPSC_STATS } from '@/data/upscData';

const StatsSection: React.FC = () => {
  const stats = [
    {
      icon: Target,
      value: UPSC_STATS.totalVacancies2024.toLocaleString(),
      label: 'Vacancies (2024)',
      color: 'text-green-500'
    },
    {
      icon: Users,
      value: '13L+',
      label: 'Annual Applicants',
      color: 'text-blue-500'
    },
    {
      icon: GraduationCap,
      value: UPSC_STATS.selectionRatio,
      label: 'Selection Rate',
      color: 'text-purple-500'
    },
    {
      icon: Calendar,
      value: UPSC_STATS.attempts.split(' ')[0],
      label: 'Max Attempts (General)',
      color: 'text-orange-500'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          viewport={{ once: true }}
          className="relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative p-6 rounded-2xl bg-card/80 backdrop-blur-sm border border-border group-hover:border-primary/50 transition-all text-center">
            <stat.icon className={`h-8 w-8 mx-auto mb-3 ${stat.color}`} />
            <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-muted-foreground">
              {stat.label}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsSection;

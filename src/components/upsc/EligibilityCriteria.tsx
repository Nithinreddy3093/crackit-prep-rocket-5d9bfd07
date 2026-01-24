import React from 'react';
import { motion } from 'framer-motion';
import { User, GraduationCap, Calendar, RefreshCw, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { UPSC_STATS } from '@/data/upscData';

const EligibilityCriteria: React.FC = () => {
  const criteria = [
    {
      icon: User,
      title: 'Nationality',
      description: 'Indian citizen (for IAS/IPS), citizen of Nepal/Bhutan for certain services',
      color: 'text-blue-500'
    },
    {
      icon: Calendar,
      title: 'Age Limit',
      description: UPSC_STATS.eligibleAge,
      color: 'text-green-500'
    },
    {
      icon: GraduationCap,
      title: 'Educational Qualification',
      description: UPSC_STATS.qualifications,
      color: 'text-purple-500'
    },
    {
      icon: RefreshCw,
      title: 'Number of Attempts',
      description: UPSC_STATS.attempts,
      color: 'text-orange-500'
    }
  ];

  return (
    <Card className="p-6 bg-card/80 backdrop-blur-sm border-border">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-primary/10">
          <CheckCircle2 className="h-5 w-5 text-primary" />
        </div>
        <h3 className="text-xl font-bold text-foreground">Eligibility Criteria</h3>
      </div>
      
      <div className="space-y-4">
        {criteria.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
            className="flex items-start gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
          >
            <div className={`p-2 rounded-lg bg-background ${item.color}`}>
              <item.icon className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-1">{item.title}</h4>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
};

export default EligibilityCriteria;

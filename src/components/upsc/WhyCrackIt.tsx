import React from 'react';
import { motion } from 'framer-motion';
import { Brain, BarChart3, Clock, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Analysis',
    description: 'Our AI identifies your weak topics and adapts question difficulty in real-time to maximize learning.',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
  },
  {
    icon: BarChart3,
    title: 'Real-time Performance Tracking',
    description: 'Subject-wise accuracy, streaks, and percentile ranking against thousands of fellow aspirants.',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
  },
  {
    icon: Clock,
    title: 'Timed Mock Tests',
    description: 'Simulate real exam pressure with timed tests for Prelims GS, CSAT, and individual subjects.',
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
  },
  {
    icon: Shield,
    title: 'UPSC-Verified Content',
    description: 'Questions aligned with the latest UPSC syllabus, PYQ patterns, and current affairs updates.',
    color: 'text-green-400',
    bg: 'bg-green-500/10',
  },
];

const WhyCrackIt: React.FC = () => {
  return (
    <section className="py-10 md:py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-12"
        >
          <Badge className="mb-3 bg-gradient-to-r from-orange-500/20 to-green-500/20 border-orange-500/30 text-foreground" >
            Why CrackIt?
          </Badge>
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-3">
            Built for Serious UPSC Aspirants
          </h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
            Every feature is designed to replicate the UPSC exam environment and accelerate your preparation.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              viewport={{ once: true }}
              className="text-center p-6 rounded-xl bg-card/80 backdrop-blur-sm border border-border hover:border-primary/30 transition-colors"
            >
              <div className={`inline-flex p-3 rounded-xl ${f.bg} mb-4`}>
                <f.icon className={`h-6 w-6 ${f.color}`} />
              </div>
              <h3 className="font-bold text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyCrackIt;

import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Lightbulb, CheckCircle2 } from 'lucide-react';
import { ProcessStep } from '@/data/companyData';

interface SelectionTimelineProps {
  steps: ProcessStep[];
}

const SelectionTimeline: React.FC<SelectionTimelineProps> = ({ steps }) => {
  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-transparent" />

      <div className="space-y-6">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            className="relative pl-16"
          >
            {/* Step number circle */}
            <div className="absolute left-0 flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 border-2 border-primary text-primary font-bold text-lg">
              {index + 1}
            </div>

            {/* Content card */}
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-4 hover:border-primary/50 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground text-lg">{step.step}</h4>
                  <p className="text-muted-foreground mt-1">{step.description}</p>
                </div>
                {step.duration && (
                  <div className="flex items-center gap-1.5 text-sm text-primary bg-primary/10 px-3 py-1 rounded-full whitespace-nowrap">
                    <Clock className="h-3.5 w-3.5" />
                    {step.duration}
                  </div>
                )}
              </div>

              {step.tips && (
                <div className="mt-3 flex items-start gap-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <Lightbulb className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-yellow-300/90">
                    <span className="font-medium">Tip:</span> {step.tips}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        ))}

        {/* Final success indicator */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: steps.length * 0.1, duration: 0.3 }}
          className="relative pl-16"
        >
          <div className="absolute left-0 flex items-center justify-center w-12 h-12 rounded-full bg-green-500/20 border-2 border-green-500 text-green-400">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div className="py-3">
            <span className="text-green-400 font-semibold">🎉 Offer Letter!</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SelectionTimeline;

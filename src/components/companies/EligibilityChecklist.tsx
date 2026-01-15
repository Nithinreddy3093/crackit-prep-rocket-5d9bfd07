import React from 'react';
import { motion } from 'framer-motion';
import { Check, AlertCircle, Info } from 'lucide-react';
import { Requirement } from '@/data/companyData';

interface EligibilityChecklistProps {
  requirements: Requirement[];
  specialConditions?: string[];
}

const EligibilityChecklist: React.FC<EligibilityChecklistProps> = ({
  requirements,
  specialConditions,
}) => {
  return (
    <div className="space-y-4">
      {/* Requirements list */}
      <div className="space-y-2">
        {requirements.map((req, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            className={`flex items-start gap-3 p-3 rounded-lg border ${
              req.mandatory
                ? 'bg-primary/5 border-primary/30'
                : 'bg-muted/20 border-border/50'
            }`}
          >
            <div
              className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                req.mandatory
                  ? 'bg-primary/20 text-primary'
                  : 'bg-muted/40 text-muted-foreground'
              }`}
            >
              <Check className="h-3 w-3" />
            </div>
            <div className="flex-1">
              <span className={req.mandatory ? 'text-foreground' : 'text-muted-foreground'}>
                {req.text}
              </span>
              {req.mandatory && (
                <span className="ml-2 text-xs text-primary font-medium">(Required)</span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Special conditions */}
      {specialConditions && specialConditions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: requirements.length * 0.05, duration: 0.3 }}
          className="mt-4 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl"
        >
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-4 w-4 text-amber-400" />
            <h4 className="font-medium text-amber-300">Special Conditions</h4>
          </div>
          <ul className="space-y-1.5">
            {specialConditions.map((condition, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-amber-200/80">
                <Info className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                {condition}
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  );
};

export default EligibilityChecklist;

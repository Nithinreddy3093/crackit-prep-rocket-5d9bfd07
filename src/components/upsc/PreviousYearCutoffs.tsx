import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UPSC_CUTOFFS } from '@/data/upscData';

const categories = [
  { key: 'general', label: 'General' },
  { key: 'obc', label: 'OBC' },
  { key: 'sc', label: 'SC' },
  { key: 'st', label: 'ST' },
  { key: 'ews', label: 'EWS' },
] as const;

const PreviousYearCutoffs: React.FC = () => {
  return (
    <Card className="p-6 bg-card/80 backdrop-blur-sm border-border">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-primary/10">
          <BarChart3 className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-foreground">Previous Year Cutoffs</h3>
          <p className="text-xs text-muted-foreground">CSE 2024 – Last 3 stages</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 pr-4 text-muted-foreground font-medium">Category</th>
              <th className="text-center py-3 px-3 text-muted-foreground font-medium">Prelims</th>
              <th className="text-center py-3 px-3 text-muted-foreground font-medium">Mains</th>
              <th className="text-center py-3 pl-3 text-muted-foreground font-medium">Final</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat, i) => {
              const data = UPSC_CUTOFFS[cat.key];
              return (
                <motion.tr
                  key={cat.key}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  viewport={{ once: true }}
                  className="border-b border-border/50 last:border-0"
                >
                  <td className="py-3 pr-4">
                    <Badge variant="outline" className="text-xs">{cat.label}</Badge>
                  </td>
                  <td className="py-3 px-3 text-center font-semibold text-foreground">{data.prelims}</td>
                  <td className="py-3 px-3 text-center font-semibold text-foreground">{data.mains}</td>
                  <td className="py-3 pl-3 text-center font-semibold text-foreground">{data.interview}</td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-muted-foreground mt-4">
        * Marks are out of 200 (Prelims), 1750 (Mains), and 2025 (Final). Source: UPSC official results.
      </p>
    </Card>
  );
};

export default PreviousYearCutoffs;

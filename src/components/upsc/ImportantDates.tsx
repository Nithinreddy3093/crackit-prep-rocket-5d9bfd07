import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UPSC_IMPORTANT_DATES } from '@/data/upscData';

const ImportantDates: React.FC = () => {
  return (
    <Card className="p-6 bg-card/80 backdrop-blur-sm border-border">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-primary/10">
          <Calendar className="h-5 w-5 text-primary" />
        </div>
        <h3 className="text-xl font-bold text-foreground">Important Dates 2025</h3>
      </div>
      
      <div className="space-y-4">
        {UPSC_IMPORTANT_DATES.map((item, index) => (
          <motion.div
            key={item.event}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            viewport={{ once: true }}
            className="flex items-center justify-between py-3 border-b border-border last:border-0"
          >
            <div className="flex items-center gap-3">
              <div className={`p-1.5 rounded-full ${
                item.status === 'completed' ? 'bg-green-500/10' : 'bg-yellow-500/10'
              }`}>
                {item.status === 'completed' ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <Clock className="h-4 w-4 text-yellow-500" />
                )}
              </div>
              <span className="text-sm text-foreground">{item.event}</span>
            </div>
            <Badge variant="outline" className="text-xs">
              {item.date}
            </Badge>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-6 p-4 rounded-lg bg-muted/50 flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground">
          Dates are tentative and subject to change. Please refer to the official UPSC website for confirmed dates.
        </p>
      </div>
    </Card>
  );
};

export default ImportantDates;

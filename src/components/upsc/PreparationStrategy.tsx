import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, BookOpen, FileText, UserCheck } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const strategies = [
  {
    icon: BookOpen,
    stage: 'Prelims',
    color: 'text-blue-400',
    bg: 'from-blue-500/10 to-indigo-500/10',
    tips: [
      'Focus on NCERT books (Class 6–12) for conceptual clarity',
      'Solve last 10 years' PYQs — many questions repeat patterns',
      'Daily current affairs (newspaper + monthly compilation)',
      'Practice elimination technique for negative marking',
    ],
  },
  {
    icon: FileText,
    stage: 'Mains',
    color: 'text-orange-400',
    bg: 'from-orange-500/10 to-amber-500/10',
    tips: [
      'Answer writing practice — at least 2 questions daily',
      'Structure answers with intro, body, conclusion & diagrams',
      'Cover all 4 GS papers with equal weightage',
      'Use case studies and data points for higher marks',
    ],
  },
  {
    icon: UserCheck,
    stage: 'Interview',
    color: 'text-green-400',
    bg: 'from-green-500/10 to-emerald-500/10',
    tips: [
      'Know your DAF (Detailed Application Form) thoroughly',
      'Stay updated on current national & international issues',
      'Practice mock interviews with peers or mentors',
      'Be honest — say "I don\'t know" rather than bluffing',
    ],
  },
];

const PreparationStrategy: React.FC = () => {
  return (
    <section className="py-10 md:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-12"
        >
          <Badge className="mb-3" variant="outline">
            <Lightbulb className="h-3 w-3 mr-1" />
            Expert Tips
          </Badge>
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-3">
            Stage-wise Preparation Strategy
          </h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
            Proven tips from top rankers and experienced educators to maximize your score at every stage.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {strategies.map((s, i) => (
            <motion.div
              key={s.stage}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full p-6 bg-card/80 backdrop-blur-sm border-border hover:border-primary/30 transition-colors">
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r ${s.bg} mb-4`}>
                  <s.icon className={`h-4 w-4 ${s.color}`} />
                  <span className={`text-sm font-semibold ${s.color}`}>{s.stage}</span>
                </div>

                <ul className="space-y-3">
                  {s.tips.map((tip, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PreparationStrategy;

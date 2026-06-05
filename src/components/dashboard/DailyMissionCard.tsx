import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, BookOpen, Target, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CONCEPT_CARDS } from '@/data/conceptCards';

interface WeakTopic { topic: string; avgScore: number }

interface Props {
  weaknesses: WeakTopic[];
  currentStreak: number;
}

// Normalise topic labels coming from quiz_results to our concept topicId space.
const normaliseTopic = (raw: string): string => {
  const t = raw.toLowerCase();
  if (t.includes('network')) return 'networking';
  if (t.includes('data structure') || t.includes('algorithm') || t === 'dsa') return 'dsa';
  if (t.includes('database') || t.includes('sql') || t.includes('dbms')) return 'dbms';
  if (t.includes('operating') || t === 'os') return 'os';
  if (t.includes('oop') || t.includes('object')) return 'oop';
  if (t.includes('apti')) return 'aptitude';
  return t.replace(/\s+/g, '-');
};

const seedFromDate = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
};

const DailyMissionCard: React.FC<Props> = ({ weaknesses, currentStreak }) => {
  const navigate = useNavigate();

  const mission = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    const weakest = weaknesses[0];
    const topicId = weakest ? normaliseTopic(weakest.topic) : 'dsa';
    const cardsForTopic = CONCEPT_CARDS.filter((c) => c.topicId === topicId);
    const pool = cardsForTopic.length ? cardsForTopic : CONCEPT_CARDS;
    const card = pool[seedFromDate(today + topicId) % pool.length];

    return {
      weakestLabel: weakest?.topic ?? 'Data Structures',
      weakestScore: weakest?.avgScore ?? null,
      card,
      topicId,
    };
  }, [weaknesses]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative rounded-2xl glass-strong overflow-hidden"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
      <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-primary/15 blur-3xl" />

      <div className="relative p-5 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary-glow">
              <Sparkles className="h-3 w-3" /> Today's 15-min mission
            </div>
            <h2 className="mt-3 font-display text-xl sm:text-2xl font-bold text-foreground">
              Fix your weakest topic: <span className="gradient-text">{mission.weakestLabel}</span>
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {mission.weakestScore !== null
                ? `You're averaging ${mission.weakestScore}%. One concept card + a short quiz today moves the needle.`
                : 'A bite-sized concept + a short quiz is all it takes to keep momentum.'}
            </p>
          </div>
          {currentStreak > 0 && (
            <div className="shrink-0 rounded-xl border border-primary/30 bg-primary/10 px-3 py-2 text-center">
              <div className="flex items-center justify-center gap-1 text-primary-glow font-bold">
                <Flame className="h-4 w-4" /> {currentStreak}
              </div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">day streak</div>
            </div>
          )}
        </div>

        <ol className="mt-5 grid sm:grid-cols-3 gap-3">
          <li className="rounded-xl border border-border/60 bg-card/40 p-3">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-primary-glow">
              <BookOpen className="h-3 w-3" /> Step 1 · 3 min
            </div>
            <div className="mt-1 text-sm font-medium text-foreground line-clamp-2">{mission.card.title}</div>
            <div className="mt-1 text-xs text-muted-foreground line-clamp-2">{mission.card.oneLiner}</div>
          </li>
          <li className="rounded-xl border border-border/60 bg-card/40 p-3">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-primary-glow">
              <Target className="h-3 w-3" /> Step 2 · 10 min
            </div>
            <div className="mt-1 text-sm font-medium text-foreground">10-question quiz</div>
            <div className="mt-1 text-xs text-muted-foreground">Adaptive — gets harder if you crush it.</div>
          </li>
          <li className="rounded-xl border border-border/60 bg-card/40 p-3">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-primary-glow">
              <Flame className="h-3 w-3" /> Step 3 · 2 min
            </div>
            <div className="mt-1 text-sm font-medium text-foreground">Lock the streak</div>
            <div className="mt-1 text-xs text-muted-foreground">Come back tomorrow — we'll pick the next weak spot.</div>
          </li>
        </ol>

        <div className="mt-5 flex flex-col sm:flex-row gap-2">
          <Button variant="premium" className="sm:flex-1" onClick={() => navigate(`/learn/${mission.card.id}`)}>
            Start mission <ArrowRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={() => navigate(`/quiz/${mission.topicId}`)}>
            Skip to quiz
          </Button>
        </div>
      </div>
    </motion.section>
  );
};

export default DailyMissionCard;

import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Check } from 'lucide-react';

const QuizPreview = () => {
  return (
    <div className="relative mx-auto w-full max-w-lg">
      {/* Glow orbs */}
      <div className="pointer-events-none absolute -right-6 -top-6 h-56 w-56 rounded-full bg-primary/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-10 -left-6 h-44 w-44 rounded-full bg-primary-glow/20 blur-3xl" />

      <div className="relative rounded-2xl glass-strong overflow-hidden">
        {/* Top accent line */}
        <div className="h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

        <div className="p-6 pb-4">
          <div className="flex justify-between items-center mb-5">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Live preview</p>
              <h3 className="font-display font-semibold text-foreground mt-0.5">Data Structures</h3>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary-glow">
              <Sparkles className="h-3 w-3" />
              AI-graded
            </span>
          </div>

          <div className="p-4 rounded-xl bg-card/80 border border-border/60">
            <h4 className="font-medium text-foreground text-sm leading-snug">
              1. What is the time complexity of quicksort in the worst case?
            </h4>
            <div className="mt-4 space-y-2">
              {[
                { label: 'O(n)' },
                { label: 'O(n log n)' },
                { label: 'O(n²)', correct: true },
                { label: 'O(n log n²)' },
              ].map((opt, i) => (
                <label
                  key={opt.label}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg border text-sm cursor-pointer transition-colors ${
                    opt.correct
                      ? 'border-primary/60 bg-primary/10 text-foreground'
                      : 'border-border/60 bg-background/40 text-muted-foreground hover:bg-card/60 hover:text-foreground'
                  }`}
                >
                  <span
                    className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                      opt.correct
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border'
                    }`}
                  >
                    {opt.correct && <Check className="h-3 w-3" />}
                  </span>
                  <span>{opt.label}</span>
                  {opt.correct && (
                    <span className="ml-auto text-[10px] uppercase tracking-wider text-primary-glow">
                      Correct
                    </span>
                  )}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 p-4 border-t border-border/60 bg-card/40">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <div className="w-full h-1.5 rounded-full bg-border/60 overflow-hidden">
                <div className="h-full w-2/5 rounded-full bg-gradient-indigo" />
              </div>
              <span className="text-xs text-muted-foreground tabular-nums">6/15</span>
            </div>
          </div>
          <Button size="sm" variant="premium">Next</Button>
        </div>
      </div>
    </div>
  );
};

export default QuizPreview;

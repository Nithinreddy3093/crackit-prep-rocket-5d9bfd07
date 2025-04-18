
import React from 'react';
import { Button } from '@/components/ui/button';

const QuizPreview = () => {
  return (
    <div className="relative mx-auto w-full max-w-lg">
      <div className="absolute -right-4 top-0 h-72 w-72 bg-primary/20 dark:bg-primary/10 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-pulse-glow"></div>
      <div className="absolute -bottom-12 left-8 h-56 w-56 bg-blue-200 dark:bg-blue-900/40 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
      
      <div className="relative rounded-2xl bg-card shadow-lg overflow-hidden border border-border">
        <div className="p-6 pb-0">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-foreground">Topic: Data Structures</h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400">
              15 Questions
            </span>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium text-foreground text-sm">1. What is the time complexity of the quicksort algorithm in the worst case?</h4>
              <div className="mt-3 space-y-2">
                <div className="flex items-center">
                  <input type="radio" id="opt1" name="q1" className="h-4 w-4 text-primary border-border rounded" />
                  <label htmlFor="opt1" className="ml-2 text-sm text-muted-foreground">O(n)</label>
                </div>
                <div className="flex items-center">
                  <input type="radio" id="opt2" name="q1" className="h-4 w-4 text-primary border-border rounded" />
                  <label htmlFor="opt2" className="ml-2 text-sm text-muted-foreground">O(n log n)</label>
                </div>
                <div className="flex items-center">
                  <input type="radio" id="opt3" name="q1" className="h-4 w-4 text-primary border-border rounded" />
                  <label htmlFor="opt3" className="ml-2 text-sm text-muted-foreground">O(n²)</label>
                </div>
                <div className="flex items-center">
                  <input type="radio" id="opt4" name="q1" className="h-4 w-4 text-primary border-border rounded" />
                  <label htmlFor="opt4" className="ml-2 text-sm text-muted-foreground">O(n log n²)</label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between p-4 bg-muted/20 mt-4 border-t border-border">
          <div className="flex-1">
            <div className="flex items-center">
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '40%' }}></div>
              </div>
              <span className="ml-2 text-xs text-muted-foreground">6/15</span>
            </div>
          </div>
          <Button size="sm" className="bg-primary hover:bg-primary/90">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuizPreview;

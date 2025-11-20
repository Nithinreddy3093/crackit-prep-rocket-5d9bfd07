import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Infinity } from 'lucide-react';

interface QuizModeSelectorProps {
  onSelectMode: (mode: 'practice' | 'exam') => void;
}

const QuizModeSelector: React.FC<QuizModeSelectorProps> = ({ onSelectMode }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5">
      <Card className="max-w-2xl w-full">
        <CardContent className="p-8">
          <h2 className="text-3xl font-bold text-center mb-2">Select Quiz Mode</h2>
          <p className="text-center text-muted-foreground mb-8">
            Choose your preferred learning experience
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div 
              className="p-6 rounded-lg border-2 border-border hover:border-primary transition-all cursor-pointer group"
              onClick={() => onSelectMode('practice')}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Infinity className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Practice Mode</h3>
                <p className="text-sm text-muted-foreground">
                  Take your time to learn. No time pressure, instant feedback after each question.
                </p>
                <ul className="text-sm space-y-2 text-left w-full">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">✓</span>
                    <span>Unlimited time per question</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">✓</span>
                    <span>Instant explanations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">✓</span>
                    <span>Pause and resume anytime</span>
                  </li>
                </ul>
                <Button className="w-full">Start Practice</Button>
              </div>
            </div>

            <div 
              className="p-6 rounded-lg border-2 border-border hover:border-primary transition-all cursor-pointer group"
              onClick={() => onSelectMode('exam')}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Exam Mode</h3>
                <p className="text-sm text-muted-foreground">
                  Test yourself under real exam conditions with time limits and pressure.
                </p>
                <ul className="text-sm space-y-2 text-left w-full">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">✓</span>
                    <span>Timed questions (60s each)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">✓</span>
                    <span>Results at the end</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">✓</span>
                    <span>Simulates real interviews</span>
                  </li>
                </ul>
                <Button className="w-full" variant="outline">Start Exam</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizModeSelector;

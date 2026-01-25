import React from 'react';
import { motion } from 'framer-motion';
import { Target, Flame, CheckCircle2, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';

interface DailyTargetTrackerProps {
  questionsCompleted?: number;
  dailyTarget?: number;
  streak?: number;
}

const DailyTargetTracker: React.FC<DailyTargetTrackerProps> = ({
  questionsCompleted = 0,
  dailyTarget = 50,
  streak = 0,
}) => {
  const navigate = useNavigate();
  const progress = Math.min((questionsCompleted / dailyTarget) * 100, 100);
  const isCompleted = questionsCompleted >= dailyTarget;

  return (
    <Card className="p-4 bg-gradient-to-br from-orange-500/10 via-card to-green-500/10 border-orange-500/20">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-orange-500/20">
            <Target className="h-4 w-4 text-orange-500" />
          </div>
          <div>
            <h4 className="font-semibold text-foreground text-sm">Daily Target</h4>
            <p className="text-xs text-muted-foreground">
              {questionsCompleted}/{dailyTarget} questions
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-500/20 text-orange-500">
          <Flame className="h-3.5 w-3.5" />
          <span className="text-sm font-bold">{streak}</span>
        </div>
      </div>

      <div className="space-y-2">
        <Progress value={progress} className="h-2" />
        
        <div className="flex items-center justify-between">
          {isCompleted ? (
            <div className="flex items-center gap-1.5 text-green-500">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-xs font-medium">Target completed!</span>
            </div>
          ) : (
            <span className="text-xs text-muted-foreground">
              {dailyTarget - questionsCompleted} more to go
            </span>
          )}
          
          <Button
            size="sm"
            variant="ghost"
            className="h-7 text-xs text-primary hover:text-primary"
            onClick={() => navigate('/quiz/upsc-polity?mode=quick')}
          >
            Continue
            <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default DailyTargetTracker;
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Flame } from 'lucide-react';

interface StreakCounterProps {
  currentStreak: number;
  longestStreak: number;
}

const StreakCounter: React.FC<StreakCounterProps> = ({ currentStreak, longestStreak }) => {
  return (
    <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Current Streak</p>
            <div className="flex items-center gap-2">
              <Flame className="h-8 w-8 text-orange-500 animate-pulse" />
              <span className="text-4xl font-bold text-foreground">{currentStreak}</span>
              <span className="text-lg text-muted-foreground">days</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground mb-1">Longest Streak</p>
            <p className="text-2xl font-semibold text-foreground">{longestStreak} days</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StreakCounter;

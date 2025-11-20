import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface HeatmapDay {
  date: string;
  count: number;
}

interface StudyHeatmapProps {
  data: HeatmapDay[];
}

const StudyHeatmap: React.FC<StudyHeatmapProps> = ({ data }) => {
  const getIntensity = (count: number) => {
    if (count === 0) return 'bg-muted';
    if (count <= 2) return 'bg-primary/20';
    if (count <= 5) return 'bg-primary/40';
    if (count <= 8) return 'bg-primary/60';
    return 'bg-primary';
  };

  const weeks = [];
  for (let i = 0; i < data.length; i += 7) {
    weeks.push(data.slice(i, i + 7));
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Study Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-1 overflow-x-auto pb-2">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((day, dayIndex) => (
                <TooltipProvider key={dayIndex}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div 
                        className={`w-3 h-3 rounded-sm ${getIntensity(day.count)} transition-colors`}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">{day.date}: {day.count} quizzes</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 bg-muted rounded-sm" />
            <div className="w-3 h-3 bg-primary/20 rounded-sm" />
            <div className="w-3 h-3 bg-primary/40 rounded-sm" />
            <div className="w-3 h-3 bg-primary/60 rounded-sm" />
            <div className="w-3 h-3 bg-primary rounded-sm" />
          </div>
          <span>More</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudyHeatmap;

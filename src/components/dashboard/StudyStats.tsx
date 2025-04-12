
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

export interface PerformanceStat {
  topic: string;
  progress: number;
  quizzesTaken: number;
  averageScore: number;
}

interface StudyStatsProps {
  performanceStats: PerformanceStat[];
}

const StudyStats: React.FC<StudyStatsProps> = ({ performanceStats }) => {
  return (
    <Card className="bg-darkBlue-800 border-darkBlue-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl text-white">Your Performance</CardTitle>
          <BarChart className="h-5 w-5 text-primary" />
        </div>
        <CardDescription className="text-gray-400">
          Track your progress across different topics
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {performanceStats.map((stat, index) => (
            <div key={index}>
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium text-white">{stat.topic}</p>
                <span className="text-sm text-gray-400">{stat.progress}%</span>
              </div>
              <div className="w-full bg-darkBlue-700 rounded-full h-2.5">
                <div 
                  className="bg-primary h-2.5 rounded-full" 
                  style={{ width: `${stat.progress}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-400">
                <span>Quizzes taken: {stat.quizzesTaken}</span>
                <span>Avg. score: {stat.averageScore}%</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default StudyStats;

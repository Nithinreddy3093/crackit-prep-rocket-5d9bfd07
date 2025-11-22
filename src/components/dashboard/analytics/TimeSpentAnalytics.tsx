import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Calendar, Zap } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'framer-motion';

interface TimeSpentData {
  topic: string;
  minutes: number;
  efficiency: number;
}

interface TimeSpentAnalyticsProps {
  data: TimeSpentData[];
  totalTime: number;
  avgTimePerQuiz: number;
  mostProductiveTime: string;
}

const TimeSpentAnalytics: React.FC<TimeSpentAnalyticsProps> = ({ 
  data, 
  totalTime, 
  avgTimePerQuiz,
  mostProductiveTime 
}) => {
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };

  const getBarColor = (efficiency: number) => {
    if (efficiency >= 80) return 'hsl(var(--primary))';
    if (efficiency >= 60) return 'hsl(142 76% 36%)'; // green
    return 'hsl(var(--muted-foreground))';
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-foreground">{payload[0].payload.topic}</p>
          <p className="text-sm text-muted-foreground">Time: {payload[0].payload.minutes}m</p>
          <p className="text-sm text-primary">Efficiency: {payload[0].payload.efficiency}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-card/80 backdrop-blur border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Study Time</p>
                  <p className="text-2xl font-bold text-foreground">{formatTime(totalTime)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-card/80 backdrop-blur border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-green-500/10">
                  <Zap className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg Time/Quiz</p>
                  <p className="text-2xl font-bold text-foreground">{formatTime(avgTimePerQuiz)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-card/80 backdrop-blur border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-accent">
                  <Calendar className="h-6 w-6 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Most Productive</p>
                  <p className="text-xl font-bold text-foreground">{mostProductiveTime}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Time by Topic Chart */}
      <Card className="bg-card/80 backdrop-blur border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Time Spent by Topic</CardTitle>
          <p className="text-sm text-muted-foreground">Color indicates learning efficiency</p>
        </CardHeader>
        <CardContent>
          {data.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 60 }}>
                <XAxis 
                  dataKey="topic" 
                  angle={-45} 
                  textAnchor="end" 
                  height={80}
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="minutes" radius={[8, 8, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getBarColor(entry.efficiency)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No time data available yet</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TimeSpentAnalytics;

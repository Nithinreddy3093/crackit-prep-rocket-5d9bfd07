import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';
import { TrendingUp, Activity, Target } from 'lucide-react';
import { motion } from 'framer-motion';

interface TrendData {
  date: string;
  score: number;
  accuracy: number;
  speed: number;
}

interface ImprovementTrendsProps {
  data: TrendData[];
  overallTrend: 'improving' | 'stable' | 'declining';
  improvementRate: number;
}

const ImprovementTrends: React.FC<ImprovementTrendsProps> = ({ 
  data, 
  overallTrend,
  improvementRate 
}) => {
  const getTrendColor = () => {
    switch (overallTrend) {
      case 'improving': return 'text-green-500';
      case 'declining': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getTrendIcon = () => {
    switch (overallTrend) {
      case 'improving': return <TrendingUp className="h-5 w-5" />;
      case 'declining': return <TrendingUp className="h-5 w-5 rotate-180" />;
      default: return <Activity className="h-5 w-5" />;
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-foreground mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}%
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Trend Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-card/80 backdrop-blur border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Overall Trend</p>
                  <p className={`text-xl font-bold capitalize ${getTrendColor()}`}>
                    {overallTrend}
                  </p>
                </div>
                <div className={getTrendColor()}>
                  {getTrendIcon()}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-card/80 backdrop-blur border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Improvement Rate</p>
                  <p className="text-xl font-bold text-primary">
                    {improvementRate > 0 ? '+' : ''}{improvementRate}%
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-primary/10">
                  <Target className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-card/80 backdrop-blur border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Recent Average</p>
                  <p className="text-xl font-bold text-foreground">
                    {data.length > 0 ? Math.round(data.slice(-5).reduce((sum, d) => sum + d.score, 0) / Math.min(5, data.length)) : 0}%
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-accent">
                  <Activity className="h-5 w-5 text-accent-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Performance Trends Chart */}
      <Card className="bg-card/80 backdrop-blur border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Performance Trends Over Time</CardTitle>
          <p className="text-sm text-muted-foreground">Track your score, accuracy, and speed improvements</p>
        </CardHeader>
        <CardContent>
          {data.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  stroke="hsl(var(--border))"
                />
                <YAxis 
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  stroke="hsl(var(--border))"
                  domain={[0, 100]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ color: 'hsl(var(--foreground))' }}
                  iconType="line"
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  name="Score"
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="accuracy" 
                  name="Accuracy"
                  stroke="hsl(142 76% 36%)" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(142 76% 36%)', r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="speed" 
                  name="Speed"
                  stroke="hsl(48 96% 53%)" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(48 96% 53%)', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[350px] flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Complete more quizzes to see your progress trends</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ImprovementTrends;

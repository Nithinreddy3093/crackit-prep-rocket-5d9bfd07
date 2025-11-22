import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Award, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface TopicStat {
  topic: string;
  avgScore: number;
  attempts: number;
  totalTime: number;
  trend: 'up' | 'down' | 'stable';
}

interface TopicAnalyticsProps {
  strengths: TopicStat[];
  weaknesses: TopicStat[];
}

const TopicAnalytics: React.FC<TopicAnalyticsProps> = ({ strengths, weaknesses }) => {
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const renderTopicCard = (topic: TopicStat, index: number, isStrength: boolean) => (
    <motion.div
      key={topic.topic}
      initial={{ opacity: 0, x: isStrength ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="p-4 rounded-lg bg-card border border-border hover:border-primary/50 transition-smooth"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h4 className="font-semibold text-foreground mb-1">{topic.topic}</h4>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{topic.attempts} attempts</span>
            <span>•</span>
            <span>{formatTime(topic.totalTime)}</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className={`text-2xl font-bold ${isStrength ? 'text-green-500' : 'text-destructive'}`}>
            {topic.avgScore}%
          </span>
          {topic.trend !== 'stable' && (
            <div className={`flex items-center gap-1 ${topic.trend === 'up' ? 'text-green-500' : 'text-destructive'}`}>
              {topic.trend === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            </div>
          )}
        </div>
      </div>
      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${topic.avgScore}%` }}
          transition={{ duration: 0.8, delay: index * 0.1 }}
          className={`h-full ${isStrength ? 'bg-green-500' : 'bg-destructive'}`}
        />
      </div>
    </motion.div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Strengths */}
      <Card className="border-green-500/20 bg-card/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Award className="h-5 w-5 text-green-500" />
            Your Strengths
          </CardTitle>
          <p className="text-sm text-muted-foreground">Topics where you excel</p>
        </CardHeader>
        <CardContent className="space-y-3">
          {strengths.length > 0 ? (
            strengths.map((topic, index) => renderTopicCard(topic, index, true))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Award className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Complete more quizzes to discover your strengths</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Weaknesses */}
      <Card className="border-destructive/20 bg-card/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <AlertCircle className="h-5 w-5 text-destructive" />
            Areas to Improve
          </CardTitle>
          <p className="text-sm text-muted-foreground">Topics that need more practice</p>
        </CardHeader>
        <CardContent className="space-y-3">
          {weaknesses.length > 0 ? (
            weaknesses.map((topic, index) => renderTopicCard(topic, index, false))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <AlertCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Great! No weak areas identified yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TopicAnalytics;

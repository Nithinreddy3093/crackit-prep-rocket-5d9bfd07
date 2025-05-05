
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Loader2 } from 'lucide-react';
import { PerformanceStat } from '@/services/performance/types';

interface TopicComparisonProps {
  stats: PerformanceStat[];
  loading: boolean;
}

const TopicComparison: React.FC<TopicComparisonProps> = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
          <p className="text-muted-foreground">Loading topic data...</p>
        </div>
      </div>
    );
  }

  if (stats.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-lg">
        <p className="text-muted-foreground">No topic data available yet.</p>
      </div>
    );
  }

  return (
    <div className="h-[300px] mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={stats}
          margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="topic"
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            interval={0}
            height={70}
          />
          <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
          <Tooltip />
          <Bar
            dataKey="averageScore"
            name="Average Score"
            fill="#0ea5e9"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopicComparison;

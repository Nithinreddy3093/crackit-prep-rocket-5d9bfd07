import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SkillData {
  skill: string;
  score: number;
  fullMark: number;
}

interface SkillRadarChartProps {
  data: SkillData[];
}

const SkillRadarChart: React.FC<SkillRadarChartProps> = ({ data }) => {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Skill Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={data}>
            <PolarGrid stroke="hsl(var(--border))" />
            <PolarAngleAxis 
              dataKey="skill" 
              tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
            />
            <PolarRadiusAxis angle={90} domain={[0, 100]} />
            <Radar 
              name="Score" 
              dataKey="score" 
              stroke="hsl(var(--primary))" 
              fill="hsl(var(--primary))" 
              fillOpacity={0.6} 
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--background))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default SkillRadarChart;

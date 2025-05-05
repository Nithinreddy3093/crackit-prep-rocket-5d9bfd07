
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface PerformanceChartProps {
  historyData: any[];
  loading: boolean;
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({ historyData, loading }) => {
  if (loading) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
          <p className="text-muted-foreground">Loading performance data...</p>
        </div>
      </div>
    );
  }

  if (historyData.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-lg">
        <p className="text-muted-foreground">No performance data available yet.</p>
      </div>
    );
  }

  return (
    <div className="h-[300px] mt-4">
      <ChartContainer
        className="h-[300px]"
        config={{
          dsa: { label: "DSA", theme: { light: "#0ea5e9", dark: "#0ea5e9" }},
          os: { label: "OS", theme: { light: "#f97316", dark: "#f97316" }},
          db: { label: "Database", theme: { light: "#8b5cf6", dark: "#8b5cf6" }},
          oop: { label: "OOP", theme: { light: "#10b981", dark: "#10b981" }}
        }}
      >
        <LineChart data={historyData[0]?.data || []}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
          <Tooltip content={<ChartTooltipContent />} />
          <Legend />
          {historyData.map((series, index) => {
            let stroke = "#0ea5e9";
            if (series.topic.includes("Operating")) stroke = "#f97316";
            if (series.topic.includes("Database")) stroke = "#8b5cf6";
            if (series.topic.includes("Object")) stroke = "#10b981";
            
            return (
              <Line 
                key={index}
                type="monotone" 
                dataKey="score" 
                name={series.topic} 
                stroke={stroke}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            );
          })}
        </LineChart>
      </ChartContainer>
    </div>
  );
};

export default PerformanceChart;

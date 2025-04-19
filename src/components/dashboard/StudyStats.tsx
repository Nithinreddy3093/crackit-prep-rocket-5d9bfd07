import React, { useEffect, useState } from 'react';
import { ArrowUp, ArrowDown, BarChart2, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { getPerformanceHistory, getUserPerformance } from '@/services/userPerformanceService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

export interface PerformanceStat {
  topic: string;
  progress: number;
  quizzesTaken: number;
  averageScore: number;
}

interface StudyStatsProps {
  performanceStats?: PerformanceStat[];
}

const StudyStats: React.FC<StudyStatsProps> = ({ performanceStats: propStats }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<PerformanceStat[]>([]);
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [overallScore, setOverallScore] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (user) {
          if (propStats) {
            setStats(propStats);
          } else {
            const performance = await getUserPerformance(user.id);
            setOverallScore(performance.overallScore);
            
            const fetchedStats = Object.entries(performance.topicScores).map(([topic, score]) => ({
              topic,
              progress: score,
              quizzesTaken: performance.quizzesTaken,
              averageScore: score
            }));
            setStats(fetchedStats);
          }
          
          const history = await getPerformanceHistory(user.id);
          
          const historyByTopic: Record<string, any[]> = {};
          history.forEach(item => {
            if (!historyByTopic[item.topic]) {
              historyByTopic[item.topic] = [];
            }
            historyByTopic[item.topic].push({
              date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
              score: item.score
            });
          });
          
          const transformedData = Object.entries(historyByTopic).map(([topic, data]) => {
            data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            return {
              topic,
              data
            };
          });
          
          setHistoryData(transformedData);
        }
      } catch (error) {
        console.error('Error fetching study stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, propStats]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Study Progress</CardTitle>
          <CardDescription>Your performance across different subjects</CardDescription>
        </CardHeader>
        <CardContent className="min-h-[400px] flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
            <p className="text-muted-foreground">Loading your stats...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Study Progress</CardTitle>
          <CardDescription>Your performance across different subjects</CardDescription>
        </div>
        <div className="flex items-center px-4 py-2 bg-primary/10 rounded-md">
          <div className="text-md font-semibold mr-2">Overall Score:</div>
          <div className="text-2xl font-bold text-primary">{overallScore}%</div>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-6">
          {stats.map((stat, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">{stat.topic}</p>
                  <p className="text-sm text-muted-foreground">
                    {stat.quizzesTaken} quiz{stat.quizzesTaken !== 1 ? "zes" : ""} taken
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${
                    stat.averageScore >= 75 ? 'text-green-500' : 
                    stat.averageScore >= 60 ? 'text-yellow-500' : 'text-red-500'
                  }`}>
                    {stat.averageScore}%
                  </span>
                  {stat.averageScore >= 70 ? (
                    <ArrowUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowDown className="h-4 w-4 text-red-500" />
                  )}
                </div>
              </div>
              <Progress value={stat.progress} className="h-2" />
            </div>
          ))}
        </div>

        {historyData.length > 0 && (
          <div className="pt-4">
            <div className="flex items-center mb-4">
              <BarChart2 className="h-5 w-5 text-primary mr-2" />
              <h3 className="font-medium">Performance Trends</h3>
            </div>
            
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
          </div>
        )}
        
        <div className="pt-4">
          <div className="flex items-center mb-4">
            <BarChart2 className="h-5 w-5 text-primary mr-2" />
            <h3 className="font-medium">Topic Comparison</h3>
          </div>
          
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
        </div>
      </CardContent>
    </Card>
  );
};

export default StudyStats;

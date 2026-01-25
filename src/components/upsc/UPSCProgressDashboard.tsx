import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, Award, Clock, Target, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import SubjectProgressRing from './SubjectProgressRing';
import DailyTargetTracker from './DailyTargetTracker';
import { UPSC_SUBJECTS } from '@/data/upscData';

interface SubjectProgress {
  subjectId: string;
  progress: number;
  score: number;
  trend: 'up' | 'down' | 'stable';
}

interface UPSCProgressDashboardProps {
  userName?: string;
  overallProgress?: number;
  subjectProgress?: SubjectProgress[];
  questionsToday?: number;
  streak?: number;
}

const UPSCProgressDashboard: React.FC<UPSCProgressDashboardProps> = ({
  userName = 'Aspirant',
  overallProgress = 0,
  subjectProgress = [],
  questionsToday = 0,
  streak = 0,
}) => {
  const navigate = useNavigate();

  // Mock data for demo - in production, this comes from props/API
  const mockSubjectProgress: SubjectProgress[] = subjectProgress.length > 0 ? subjectProgress : [
    { subjectId: 'upsc-polity', progress: 45, score: 72, trend: 'up' },
    { subjectId: 'upsc-history', progress: 30, score: 65, trend: 'up' },
    { subjectId: 'upsc-geography', progress: 25, score: 58, trend: 'down' },
    { subjectId: 'upsc-economy', progress: 20, score: 60, trend: 'stable' },
    { subjectId: 'upsc-science', progress: 15, score: 55, trend: 'up' },
    { subjectId: 'upsc-current-affairs', progress: 10, score: 48, trend: 'down' },
  ];

  const getSubjectInfo = (id: string) => UPSC_SUBJECTS.find(s => s.id === id);

  const weakAreas = mockSubjectProgress
    .filter(s => s.score < 60)
    .sort((a, b) => a.score - b.score)
    .slice(0, 3);

  const strongAreas = mockSubjectProgress
    .filter(s => s.score >= 65)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Welcome & Daily Target */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4 bg-gradient-to-br from-primary/10 via-card to-primary/5 border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Welcome back,</p>
              <h3 className="text-xl font-bold text-foreground">{userName}</h3>
              <p className="text-xs text-muted-foreground mt-1">Keep the momentum going!</p>
            </div>
            <div className="relative">
              <SubjectProgressRing progress={overallProgress || 28} size={64} strokeWidth={5} />
              <p className="text-center text-[10px] text-muted-foreground mt-1">Overall</p>
            </div>
          </div>
        </Card>

        <DailyTargetTracker 
          questionsCompleted={questionsToday || 12} 
          dailyTarget={50} 
          streak={streak || 5} 
        />
      </div>

      {/* Subject Progress Grid - Horizontal Scroll on Mobile */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-foreground">Subject Progress</h4>
          <Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => navigate('/dashboard')}>
            View All <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        </div>
        
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-3 lg:grid-cols-6 scrollbar-hide">
          {mockSubjectProgress.slice(0, 6).map((subject, index) => {
            const info = getSubjectInfo(subject.subjectId);
            if (!info) return null;
            
            return (
              <motion.div
                key={subject.subjectId}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex-shrink-0 w-[140px] md:w-auto"
              >
                <Card
                  className="p-3 cursor-pointer hover:border-primary/50 transition-all group"
                  onClick={() => navigate(`/quiz/${subject.subjectId}`)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <SubjectProgressRing 
                      progress={subject.progress} 
                      size={36} 
                      strokeWidth={3}
                    />
                    <div className={`flex items-center gap-0.5 text-xs ${
                      subject.trend === 'up' ? 'text-green-500' : 
                      subject.trend === 'down' ? 'text-red-500' : 'text-muted-foreground'
                    }`}>
                      {subject.trend === 'up' ? <TrendingUp className="h-3 w-3" /> : 
                       subject.trend === 'down' ? <TrendingDown className="h-3 w-3" /> : null}
                      <span className="font-medium">{subject.score}%</span>
                    </div>
                  </div>
                  <p className="text-xs font-medium text-foreground truncate group-hover:text-primary transition-colors">
                    {info.title.split(' ')[0]}
                  </p>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Weak Areas Alert */}
      {weakAreas.length > 0 && (
        <Card className="p-4 bg-red-500/5 border-red-500/20">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-red-500/20 shrink-0">
              <Target className="h-4 w-4 text-red-500" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-foreground text-sm mb-1">Focus Areas</h4>
              <p className="text-xs text-muted-foreground mb-2">
                These subjects need more attention based on your scores.
              </p>
              <div className="flex flex-wrap gap-1.5">
                {weakAreas.map(area => {
                  const info = getSubjectInfo(area.subjectId);
                  return info ? (
                    <Badge 
                      key={area.subjectId}
                      variant="outline" 
                      className="text-xs cursor-pointer hover:bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400"
                      onClick={() => navigate(`/quiz/${area.subjectId}`)}
                    >
                      {info.title.split('&')[0].trim()} ({area.score}%)
                    </Badge>
                  ) : null;
                })}
              </div>
            </div>
          </div>
        </Card>
      )}
    </motion.div>
  );
};

export default UPSCProgressDashboard;
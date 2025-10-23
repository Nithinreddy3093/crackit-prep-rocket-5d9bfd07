import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, TrendingUp, BookOpen, Target } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface Skill {
  skill_name: string;
  skill_percentage: number;
  subskills: any;
  improvement_plan: any;
}

interface WeakArea {
  skill: string;
  percentage: number;
  recommendation: string[];
  priority: string;
}

const SkillTracker = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInsight, setShowInsight] = useState(false);
  const [weakArea, setWeakArea] = useState<WeakArea | null>(null);

  useEffect(() => {
    if (user) {
      fetchSkills();
    }
  }, [user]);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_skills')
        .select('*')
        .eq('user_id', user?.id)
        .order('skill_percentage', { ascending: true });

      if (error) throw error;

      setSkills(data || []);

      // Check for weak areas
      const weak = data?.find((skill: any) => skill.skill_percentage < 50);
      if (weak) {
        let recommendations: string[] = [];
        let priority = 'medium';
        
        if (weak.improvement_plan && typeof weak.improvement_plan === 'object') {
          const plan = weak.improvement_plan as any;
          if (Array.isArray(plan.recommendations)) {
            recommendations = plan.recommendations;
          }
          if (plan.priority) {
            priority = plan.priority;
          }
        }
        
        setWeakArea({
          skill: weak.skill_name,
          percentage: weak.skill_percentage,
          recommendation: recommendations,
          priority: priority,
        });
        setShowInsight(true);
      }
    } catch (error) {
      console.error('Error fetching skills:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSkillColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-500';
    if (percentage >= 60) return 'text-blue-500';
    if (percentage >= 40) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getSkillBgColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-blue-500';
    if (percentage >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Target className="h-6 w-6" />
            Skill Tracker
          </h2>
          <Badge variant="outline" className="text-white border-white/20">
            {skills.length} Skills Tracked
          </Badge>
        </div>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Card key={i} className="p-4 bg-white/5 backdrop-blur-sm border-white/10">
                <Skeleton className="h-6 w-40 mb-2" />
                <Skeleton className="h-4 w-full" />
              </Card>
            ))}
          </div>
        ) : skills.length === 0 ? (
          <Card className="p-8 bg-white/5 backdrop-blur-sm border-white/10 text-center">
            <Target className="h-12 w-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/60">
              Complete quizzes to track your skills
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {skills.map((skill) => (
              <Card
                key={skill.skill_name}
                className="p-4 bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-white">
                    {skill.skill_name}
                  </h3>
                  <span className={`text-2xl font-bold ${getSkillColor(skill.skill_percentage)}`}>
                    {skill.skill_percentage}%
                  </span>
                </div>
                <Progress 
                  value={skill.skill_percentage} 
                  className="h-3 mb-3"
                />
                
                {/* Subskills */}
                {skill.subskills && typeof skill.subskills === 'object' && !Array.isArray(skill.subskills) && Object.keys(skill.subskills).length > 0 && (
                  <div className="mt-3 space-y-2">
                    {Object.entries(skill.subskills).map(([subskill, percentage]) => {
                      const percentValue = typeof percentage === 'number' ? percentage : 0;
                      return (
                        <div key={subskill} className="flex items-center justify-between text-sm">
                          <span className="text-white/70">{subskill}</span>
                          <div className="flex items-center gap-2">
                            <Progress 
                              value={percentValue} 
                              className="h-2 w-24"
                            />
                            <span className="text-white/50 w-12 text-right">
                              {percentValue}%
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Warning for weak skills */}
                {skill.skill_percentage < 50 && (
                  <div className="mt-3 flex items-start gap-2 p-2 bg-red-500/10 border border-red-500/20 rounded">
                    <AlertCircle className="h-4 w-4 text-red-400 mt-0.5" />
                    <p className="text-xs text-red-200">
                      Needs improvement - practice recommended
                    </p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* AI Insight Popup */}
      <Dialog open={showInsight} onOpenChange={setShowInsight}>
        <DialogContent className="bg-darkBlue-800 border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              🎯 SKILL INSIGHT ALERT!
            </DialogTitle>
            <DialogDescription className="text-white/80">
              We've detected areas where you can improve
            </DialogDescription>
          </DialogHeader>
          
          {weakArea && (
            <div className="space-y-4">
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <h3 className="font-semibold mb-2">
                  Your {weakArea.skill} skills need improvement ({weakArea.percentage}% - Weak)
                </h3>
                <p className="text-sm text-white/70">
                  You're scoring below 50% in this area
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  RECOMMENDED ACTIONS:
                </h4>
                <ul className="space-y-2">
                  {weakArea.recommendation.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-white/80">
                      <span className="text-primary font-bold">{index + 1}.</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>

              <Button 
                onClick={() => setShowInsight(false)}
                className="w-full"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Start Improving
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SkillTracker;

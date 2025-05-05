
import React, { useEffect, useState } from 'react';
import { Code, Database, Cpu, Brain, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getUserBadges } from '@/services/performance/badgeService';
import { useAuth } from '@/contexts/AuthContext';

export interface BadgeType {
  id: string;
  name: string;
  icon: string;
  description: string;
  earned: boolean;
  earnedDate?: string;
}

const Badges: React.FC = () => {
  const { user } = useAuth();
  const [badges, setBadges] = useState<BadgeType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        setLoading(true);
        if (user) {
          const userBadges = await getUserBadges(user.id);
          
          // Add some default badges if none exist
          if (userBadges.length === 0) {
            setBadges([
              {
                id: "algorithm-master",
                name: "Algorithm Master",
                icon: "Code",
                description: "Scored above 75% in Data Structures and Algorithms quiz",
                earned: false
              },
              {
                id: "sql-expert",
                name: "SQL Expert",
                icon: "Database",
                description: "Scored above 80% in SQL and Database Management quiz",
                earned: false
              },
              {
                id: "os-specialist",
                name: "OS Specialist",
                icon: "Cpu",
                description: "Scored above 80% in Operating Systems quiz",
                earned: false
              },
              {
                id: "ai-apprentice",
                name: "AI Apprentice",
                icon: "Brain",
                description: "Completed at least 3 AI and Machine Learning quizzes",
                earned: false
              }
            ]);
          } else {
            setBadges(userBadges);
          }
        }
      } catch (error) {
        console.error('Error fetching badges:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBadges();
  }, [user]);

  // Helper function to get the appropriate icon
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Code':
        return <Code className="h-8 w-8 text-white" />;
      case 'Database':
        return <Database className="h-8 w-8 text-white" />;
      case 'Cpu':
        return <Cpu className="h-8 w-8 text-white" />;
      case 'Brain':
        return <Brain className="h-8 w-8 text-white" />;
      default:
        return <Code className="h-8 w-8 text-white" />;
    }
  };

  // Helper function to format date
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  if (loading) {
    return (
      <Card className="bg-darkBlue-800 border-darkBlue-700">
        <CardHeader>
          <CardTitle className="text-xl text-white">Badges & Achievements</CardTitle>
          <CardDescription className="text-gray-400">
            Recognition of your accomplishments
          </CardDescription>
        </CardHeader>
        <CardContent className="min-h-[200px] flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
            <p className="text-gray-400">Loading your badges...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-darkBlue-800 border-darkBlue-700">
      <CardHeader>
        <CardTitle className="text-xl text-white">Badges & Achievements</CardTitle>
        <CardDescription className="text-gray-400">
          Recognition of your accomplishments
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 py-2">
          {badges.map((badge) => (
            <div key={badge.id} className="flex flex-col items-center text-center">
              <div className={`w-16 h-16 rounded-full ${
                badge.earned ? 'bg-gradient-to-br from-primary to-accent' : 'bg-gradient-to-br from-blue-500 to-blue-700 opacity-60'
              } flex items-center justify-center mb-3`}>
                {getIconComponent(badge.icon)}
              </div>
              <p className={`${badge.earned ? 'text-white' : 'text-gray-400'} text-sm font-medium`}>
                {badge.name}
              </p>
              <p className="text-gray-400 text-xs mt-1">
                {badge.earned ? formatDate(badge.earnedDate) : 'In progress'}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Badges;

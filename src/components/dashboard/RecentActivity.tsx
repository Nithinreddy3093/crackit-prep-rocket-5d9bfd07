
import React from 'react';
import { Activity, ListChecks, BookOpen } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

// Define the Badge component
const Badge = ({ children, className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

// Import ActivityItem from types
import { ActivityItem } from '@/types/dashboard';

interface RecentActivityProps {
  activities: ActivityItem[];
  onViewAllActivity: () => void;
}

const RecentActivity = ({ activities, onViewAllActivity }: RecentActivityProps) => {
  return (
    <Card className="md:col-span-2 bg-darkBlue-800 border-darkBlue-700">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl text-white">Recent Activity</CardTitle>
          <Activity className="h-5 w-5 text-primary" />
        </div>
        <CardDescription className="text-gray-400">
          Your latest quizzes and resources
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-4 p-3 rounded-lg bg-darkBlue-700/50 hover:bg-darkBlue-700 transition-colors">
              <div className={cn(
                "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center",
                activity.type === 'quiz' ? "bg-primary/20" : "bg-accent/20"
              )}>
                {activity.type === 'quiz' ? 
                  <ListChecks className="h-5 w-5 text-primary" /> : 
                  <BookOpen className="h-5 w-5 text-accent" />
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {activity.name}
                </p>
                <div className="flex items-center mt-1">
                  <Badge className="mr-2 text-xs bg-darkBlue-600 text-gray-300">
                    {activity.topic}
                  </Badge>
                  <p className="text-xs text-gray-400">
                    {new Date(activity.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              {activity.score && (
                <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-primary">
                  {activity.score}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="ghost" 
          className="w-full text-primary hover:bg-darkBlue-700"
          onClick={onViewAllActivity}
        >
          View All Activity
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RecentActivity;

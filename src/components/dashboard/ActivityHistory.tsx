
import React from 'react';
import { Activity, ListChecks, BookOpen } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/components/ui/use-toast';
import { ActivityItem } from '@/components/dashboard/RecentActivity';

interface ActivityHistoryProps {
  activities: ActivityItem[];
}

const ActivityHistory: React.FC<ActivityHistoryProps> = ({ activities }) => {
  return (
    <Card className="bg-darkBlue-800 border-darkBlue-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl text-white">Activity History</CardTitle>
          <Activity className="h-5 w-5 text-primary" />
        </div>
        <CardDescription className="text-gray-400">
          Your recent quizzes and resource interactions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-darkBlue-700">
              <TableHead className="text-gray-300">Activity</TableHead>
              <TableHead className="text-gray-300">Topic</TableHead>
              <TableHead className="text-gray-300">Date</TableHead>
              <TableHead className="text-gray-300 text-right">Result</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activities.map((activity) => (
              <TableRow key={activity.id} className="border-darkBlue-700">
                <TableCell className="font-medium text-white">
                  <div className="flex items-center">
                    {activity.type === 'quiz' ? 
                      <ListChecks className="h-4 w-4 text-primary mr-2" /> : 
                      <BookOpen className="h-4 w-4 text-accent mr-2" />
                    }
                    {activity.name}
                  </div>
                </TableCell>
                <TableCell className="text-gray-300">{activity.topic}</TableCell>
                <TableCell className="text-gray-300">{new Date(activity.date).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  {activity.score ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-primary">
                      {activity.score}
                    </span>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full border-darkBlue-600 text-primary hover:bg-primary/10"
          onClick={() => {
            toast({
              title: "Full History",
              description: "Your complete activity history is being loaded.",
              variant: "default",
            });
          }}
        >
          View Full History
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ActivityHistory;

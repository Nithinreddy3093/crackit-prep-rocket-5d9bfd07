
import React from 'react';
import { Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Quiz type definition
export interface QuizItem {
  id: number;
  name: string;
  date: string;
  timeEstimate: string;
}

interface UpcomingQuizzesProps {
  quizzes: QuizItem[];
}

const UpcomingQuizzes = ({ quizzes }: UpcomingQuizzesProps) => {
  const navigate = useNavigate();

  return (
    <Card className="bg-darkBlue-800 border-darkBlue-700">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl text-white">Upcoming Quizzes</CardTitle>
          <Clock className="h-5 w-5 text-primary" />
        </div>
        <CardDescription className="text-gray-400">
          Recommended for you
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="p-3 rounded-lg bg-darkBlue-700/50 hover:bg-darkBlue-700 transition-colors">
              <p className="text-sm font-medium text-white truncate">{quiz.name}</p>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-gray-400 mr-1" />
                  <p className="text-xs text-gray-400">{quiz.timeEstimate}</p>
                </div>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-7 text-primary hover:bg-primary/10"
                  onClick={() => navigate(`/topics/${quiz.id}`)}
                >
                  Start
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="ghost" 
          className="w-full text-primary hover:bg-darkBlue-700"
          onClick={() => navigate('/topics')}
        >
          View All Topics
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default UpcomingQuizzes;

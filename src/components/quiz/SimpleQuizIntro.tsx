import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, BookOpen, Target } from 'lucide-react';

interface SimpleQuizIntroProps {
  topic: string;
  questionCount: number;
  onStartQuiz: () => void;
  isLoading: boolean;
}

const SimpleQuizIntro: React.FC<SimpleQuizIntroProps> = ({
  topic,
  questionCount,
  onStartQuiz,
  isLoading
}) => {
  return (
    <div className="max-w-2xl mx-auto">
      <Card className="glass-card">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-white mb-2">
            Ready for your {topic} quiz?
          </CardTitle>
          <CardDescription className="text-white/80 text-lg">
            Test your knowledge with {questionCount} carefully selected questions
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Quiz Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 p-4 bg-white/5 rounded-lg">
              <BookOpen className="h-6 w-6 text-primary" />
              <div>
                <p className="text-sm text-white/60">Questions</p>
                <p className="text-lg font-semibold text-white">{questionCount}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-4 bg-white/5 rounded-lg">
              <Clock className="h-6 w-6 text-primary" />
              <div>
                <p className="text-sm text-white/60">Estimated Time</p>
                <p className="text-lg font-semibold text-white">{Math.ceil(questionCount * 1.5)} min</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-4 bg-white/5 rounded-lg">
              <Target className="h-6 w-6 text-primary" />
              <div>
                <p className="text-sm text-white/60">Passing Score</p>
                <p className="text-lg font-semibold text-white">70%</p>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-white/5 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-2">Quiz Instructions:</h4>
            <ul className="text-white/80 space-y-1 text-sm">
              <li>• Read each question carefully</li>
              <li>• Select the best answer from the options</li>
              <li>• You can't go back to previous questions</li>
              <li>• Take your time - there's no time limit</li>
            </ul>
          </div>

          {/* Start Button */}
          <div className="text-center pt-4">
            <Button 
              onClick={onStartQuiz}
              disabled={isLoading || questionCount === 0}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white px-8 py-3 text-lg"
            >
              {isLoading ? 'Loading...' : 'Start Quiz'}
            </Button>
          </div>

          {questionCount === 0 && (
            <p className="text-center text-white/60 text-sm">
              No questions available for this topic
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SimpleQuizIntro;
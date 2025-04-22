
import React from 'react';
import { Button } from '@/components/ui/button';
import { BookOpen, CheckCircle, Clock } from 'lucide-react';

interface QuizIntroProps {
  topic: string;
  questionCount: number;
  onStartQuiz: () => void;
  isLoading?: boolean;
}

const QuizIntro: React.FC<QuizIntroProps> = ({
  topic,
  questionCount,
  onStartQuiz,
  isLoading = false
}) => {
  return (
    <div className="max-w-3xl mx-auto bg-card rounded-xl shadow-sm p-6 border border-border">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {topic} Quiz
        </h1>
        <p className="text-muted-foreground">
          Test your knowledge and improve your skills in {topic}
        </p>
      </div>
      
      <div className="space-y-6 mb-8">
        <div className="flex items-start space-x-3">
          <div className="p-2 rounded-full bg-primary/10">
            <BookOpen className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium text-foreground">Quiz Content</h3>
            <p className="text-sm text-muted-foreground">
              {questionCount} challenging questions covering key concepts in {topic}
            </p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <div className="p-2 rounded-full bg-primary/10">
            <Clock className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium text-foreground">Estimated Time</h3>
            <p className="text-sm text-muted-foreground">
              About {questionCount * 2} minutes to complete
            </p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <div className="p-2 rounded-full bg-primary/10">
            <CheckCircle className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium text-foreground">Instant Feedback</h3>
            <p className="text-sm text-muted-foreground">
              Get explanations and performance analysis after each question
            </p>
          </div>
        </div>
      </div>
      
      <div className="text-center">
        <Button
          onClick={onStartQuiz}
          disabled={isLoading}
          className="px-8 py-2"
        >
          {isLoading ? (
            <>
              <div className="h-5 w-5 mr-2 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
              Preparing Your Quiz...
            </>
          ) : (
            'Start Quiz'
          )}
        </Button>
      </div>
    </div>
  );
};

export default QuizIntro;

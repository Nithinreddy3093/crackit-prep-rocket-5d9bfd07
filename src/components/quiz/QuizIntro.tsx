
import React from 'react';
import { Button } from '@/components/ui/button';
import { BookOpen, CheckCircle, Clock, Brain } from 'lucide-react';

interface QuizIntroProps {
  topic: string;
  questionCount: number;
  onStartQuiz: () => void;
}

const QuizIntro: React.FC<QuizIntroProps> = ({ topic, questionCount, onStartQuiz }) => {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-card dark:bg-darkBlue-900/50 rounded-xl shadow-md overflow-hidden">
        <div className="p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            {topic} Quiz
          </h1>
          
          <p className="text-muted-foreground mb-6">
            Test your knowledge with {questionCount} questions about {topic}.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">No Time Limit</h3>
                <p className="text-sm text-muted-foreground">Take your time to think through each question.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                <CheckCircle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">Multiple Choice</h3>
                <p className="text-sm text-muted-foreground">Select the best answer from the options provided.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">Explanations Provided</h3>
                <p className="text-sm text-muted-foreground">Learn from detailed explanations after each question.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                <Brain className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">AI Analysis</h3>
                <p className="text-sm text-muted-foreground">Get personalized feedback based on your performance.</p>
              </div>
            </div>
          </div>
          
          <div className="bg-muted/30 p-4 rounded-lg mb-6">
            <h3 className="font-medium text-foreground mb-2">Topics Covered:</h3>
            <ul className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2">
              <li className="text-sm text-muted-foreground">• Data Structures</li>
              <li className="text-sm text-muted-foreground">• Algorithms</li>
              <li className="text-sm text-muted-foreground">• Programming Concepts</li>
              <li className="text-sm text-muted-foreground">• Problem-Solving</li>
              <li className="text-sm text-muted-foreground">• Core Principles</li>
              <li className="text-sm text-muted-foreground">• Best Practices</li>
            </ul>
          </div>
          
          <Button 
            onClick={onStartQuiz}
            className="w-full md:w-auto bg-primary hover:bg-primary/90"
            size="lg"
          >
            Start Quiz
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuizIntro;

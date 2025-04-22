
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Clock, BookOpen, AwardIcon, CircleHelp } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface QuizIntroProps {
  topic: string;
  questionCount: number;
  onStartQuiz: () => void;
  isLoading: boolean;
  onDifficultyChange?: (difficulty: 'beginner' | 'intermediate' | 'advanced') => void;
  selectedDifficulty?: 'beginner' | 'intermediate' | 'advanced';
}

const QuizIntro: React.FC<QuizIntroProps> = ({ 
  topic, 
  questionCount, 
  onStartQuiz, 
  isLoading,
  onDifficultyChange,
  selectedDifficulty = 'intermediate'
}) => {
  const handleDifficultyChange = (value: string) => {
    if (onDifficultyChange) {
      onDifficultyChange(value as 'beginner' | 'intermediate' | 'advanced');
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="bg-card dark:bg-darkBlue-900/50 border-border dark:border-darkBlue-700/50 overflow-hidden shadow-xl">
        <CardHeader className="bg-gradient-to-br from-darkBlue-800 to-darkBlue-900 border-b border-border/20 px-6 py-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center">
              <Brain className="h-10 w-10 text-primary" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-white">
            {topic} Quiz
          </CardTitle>
          <CardDescription className="text-lg text-blue-100">
            Test your knowledge in this specialized topic
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="flex flex-col items-center text-center p-4 rounded-lg bg-primary/10 border border-primary/20">
              <CircleHelp className="h-10 w-10 mb-3 text-primary" />
              <h3 className="font-medium text-foreground">{questionCount} Questions</h3>
              <p className="text-sm text-muted-foreground mt-1">Multiple choice format</p>
            </div>

            <div className="flex flex-col items-center text-center p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <Clock className="h-10 w-10 mb-3 text-green-500" />
              <h3 className="font-medium text-foreground">15-20 Minutes</h3>
              <p className="text-sm text-muted-foreground mt-1">Estimated duration</p>
            </div>

            <div className="flex flex-col items-center text-center p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <AwardIcon className="h-10 w-10 mb-3 text-amber-500" />
              <h3 className="font-medium text-foreground">AI Feedback</h3>
              <p className="text-sm text-muted-foreground mt-1">Personalized insights</p>
            </div>
          </div>

          <div className="bg-muted/30 p-6 rounded-lg mb-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <BookOpen className="mr-2 h-5 w-5 text-primary" />
              About This Quiz
            </h3>
            <p className="text-muted-foreground">
              This quiz covers key concepts in {topic}. Each question tests your understanding of fundamental principles and practical applications. After completing the quiz, you'll receive personalized AI feedback on your strengths and areas for improvement.
            </p>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Select Difficulty Level</h3>
            <Tabs 
              defaultValue={selectedDifficulty} 
              className="w-full"
              onValueChange={handleDifficultyChange}
            >
              <TabsList className="grid grid-cols-3 w-full bg-muted/50">
                <TabsTrigger 
                  value="beginner" 
                  className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-500"
                >
                  Beginner
                </TabsTrigger>
                <TabsTrigger 
                  value="intermediate"
                  className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-500"
                >
                  Intermediate
                </TabsTrigger>
                <TabsTrigger 
                  value="advanced"
                  className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-500"
                >
                  Advanced
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="beginner" className="mt-4 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <h4 className="font-medium text-blue-500">Beginner Level</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Covers fundamental concepts and basic principles, ideal for those new to {topic}.
                </p>
              </TabsContent>
              
              <TabsContent value="intermediate" className="mt-4 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <h4 className="font-medium text-amber-500">Intermediate Level</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Tests deeper understanding and application of concepts, suitable for those with some experience in {topic}.
                </p>
              </TabsContent>
              
              <TabsContent value="advanced" className="mt-4 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                <h4 className="font-medium text-red-500">Advanced Level</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Challenges you with complex scenarios and edge cases, designed for experienced practitioners of {topic}.
                </p>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>

        <CardFooter className="px-6 py-4 bg-muted/20 border-t border-border/20 flex justify-center">
          <Button 
            onClick={onStartQuiz} 
            disabled={isLoading}
            size="lg"
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white font-medium"
          >
            {isLoading ? (
              <>
                <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-2"></div>
                Preparing Questions...
              </>
            ) : (
              'Start Quiz Now'
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default QuizIntro;


import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { BookOpen, Brain, Clock, Zap, Award } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';

interface QuizIntroProps {
  topic: string;
  questionCount: number;
  onStartQuiz: () => void;
  isLoading: boolean;
  seenQuestions?: number;
}

const QuizIntro: React.FC<QuizIntroProps> = ({ 
  topic, 
  questionCount, 
  onStartQuiz, 
  isLoading,
  seenQuestions = 0
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      <Card className="bg-card/70 backdrop-blur-sm border-accent/10 shadow-lg overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-700 text-white">
          <CardTitle className="text-3xl font-bold">{topic} Quiz</CardTitle>
          <CardDescription className="text-white/80">
            Test your knowledge and skills in {topic}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6 pb-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-4 p-4 bg-secondary/30 rounded-lg">
              <div className="bg-primary/10 p-3 rounded-full">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Questions</h3>
                <p className="text-sm text-muted-foreground">{questionCount} unique questions</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-4 bg-secondary/30 rounded-lg">
              <div className="bg-primary/10 p-3 rounded-full">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Difficulty</h3>
                <p className="text-sm text-muted-foreground">Mixed levels</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-4 bg-secondary/30 rounded-lg">
              <div className="bg-primary/10 p-3 rounded-full">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Estimated Time</h3>
                <p className="text-sm text-muted-foreground">~{Math.round(questionCount * 1.5)} minutes</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-4 bg-secondary/30 rounded-lg">
              <div className="bg-primary/10 p-3 rounded-full">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Quiz Type</h3>
                <p className="text-sm text-muted-foreground">Multiple choice</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-2 bg-secondary/20 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <h3 className="font-medium flex items-center">
                <Zap className="h-4 w-4 mr-2 text-yellow-500" />
                Dynamic Question Generation
              </h3>
              {seenQuestions > 0 && (
                <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                  {seenQuestions} questions seen previously
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Our system tracks questions you've seen before and prioritizes showing you new content.
              Each quiz session contains a diverse mix of topics and difficulty levels.
            </p>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Ready to start?</h3>
            <Progress value={100} className="h-2 bg-primary/20" />
          </div>
        </CardContent>
        
        <CardFooter className="pt-2 pb-6">
          <Button 
            onClick={onStartQuiz} 
            disabled={isLoading} 
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-700 hover:from-indigo-600 hover:to-purple-800 text-white shadow-md"
          >
            {isLoading ? "Preparing Quiz..." : "Start Quiz"}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default QuizIntro;

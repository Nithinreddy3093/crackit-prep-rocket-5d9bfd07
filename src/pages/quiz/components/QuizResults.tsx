
import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { CheckCircle, Clock, Trophy, RotateCw, Upload } from 'lucide-react';

interface QuizResultsProps {
  correctAnswers: number;
  totalQuestions: number;
  elapsedTime: number;
  topicTitle?: string;
  formatTime: (ms: number) => string;
  onRestart: () => void;
  onSubmit: () => void;
  questionDetails?: {
    questionId: string;
    question: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
  }[];
}

const QuizResults: React.FC<QuizResultsProps> = ({
  correctAnswers,
  totalQuestions,
  elapsedTime,
  topicTitle,
  formatTime,
  onRestart,
  onSubmit,
  questionDetails
}) => {
  const score = Math.round((correctAnswers / totalQuestions) * 100);
  
  // Determine score color and message
  let scoreColor = "text-red-500";
  let scoreMessage = "Needs improvement";
  
  if (score >= 80) {
    scoreColor = "text-green-500";
    scoreMessage = "Excellent!";
  } else if (score >= 60) {
    scoreColor = "text-amber-500";
    scoreMessage = "Good job!";
  } else if (score >= 40) {
    scoreColor = "text-orange-500";
    scoreMessage = "Keep practicing!";
  }

  return (
    <div className="max-w-3xl mx-auto flex items-center justify-center h-full animate-fade-in-up">
      <Card className="w-full max-w-md bg-darkBlue-800 border-darkBlue-700 shadow-xl overflow-hidden">
        <div className="bg-gradient-to-br from-primary/20 to-darkBlue-900 p-6 text-center">
          <div className="inline-block rounded-full bg-white/10 p-6 backdrop-blur-sm mb-4">
            <Trophy className="h-12 w-12 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-white">Quiz Completed!</h2>
          <p className="text-blue-200 mt-1">Here's how you performed</p>
        </div>
        
        <CardContent className="p-6 space-y-6">
          <div className="text-center">
            <div className="relative inline-block">
              <div className="text-5xl font-bold mb-2 animate-pulse-glow">
                <span className={scoreColor}>{score}%</span>
              </div>
              <p className={`text-sm font-medium ${scoreColor}`}>{scoreMessage}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-darkBlue-700/30 p-3 rounded-lg">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                <span className="text-white">Correct Answers</span>
              </div>
              <span className="font-medium text-primary">{correctAnswers} / {totalQuestions}</span>
            </div>
            
            <div className="flex items-center justify-between bg-darkBlue-700/30 p-3 rounded-lg">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-blue-400 mr-3" />
                <span className="text-white">Time Taken</span>
              </div>
              <span className="font-medium text-primary">{formatTime(elapsedTime)}</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-400">
                <span>Beginner</span>
                <span>Intermediate</span>
                <span>Expert</span>
              </div>
              <Slider
                defaultValue={[score]}
                max={100}
                step={1}
                disabled
                className="cursor-default"
              />
            </div>
          </div>
        </CardContent>
        
        <div className="border-t border-darkBlue-700 p-4 bg-darkBlue-900/50">
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              onClick={onRestart}
              className="flex items-center justify-center gap-2 bg-transparent border-primary/30 text-primary hover:bg-primary/10"
            >
              <RotateCw className="h-4 w-4" />
              Retry Quiz
            </Button>
            <Button 
              onClick={onSubmit}
              className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90"
            >
              <Upload className="h-4 w-4" />
              Submit Results
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default QuizResults;

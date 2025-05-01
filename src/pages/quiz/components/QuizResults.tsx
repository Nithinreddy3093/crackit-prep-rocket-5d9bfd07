
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface QuizResultsProps {
  correctAnswers: number;
  totalQuestions: number;
  elapsedTime: number;
  topicTitle?: string;
  formatTime: (ms: number) => string;
  onRestart: () => void;
  onSubmit: () => void;
}

const QuizResults: React.FC<QuizResultsProps> = ({
  correctAnswers,
  totalQuestions,
  elapsedTime,
  topicTitle,
  formatTime,
  onRestart,
  onSubmit
}) => {
  const score = Math.round((correctAnswers / totalQuestions) * 100);

  return (
    <div className="max-w-3xl mx-auto flex items-center justify-center">
      <Card className="w-full max-w-md bg-darkBlue-800 border-darkBlue-700">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">Quiz Completed!</CardTitle>
          <CardDescription className="text-gray-400">Here are your results:</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-white">Topic:</span>
            <span className="font-medium text-primary">{topicTitle}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white">Time Taken:</span>
            <span className="font-medium text-primary">{formatTime(elapsedTime)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white">Your Score:</span>
            <span className="font-bold text-3xl text-primary">{score}%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white">Correct Answers:</span>
            <span className="font-medium text-primary">{correctAnswers} / {totalQuestions}</span>
          </div>
        </CardContent>
        
        <div className="flex justify-between p-6">
          <Button variant="secondary" onClick={onRestart}>
            Restart Quiz
          </Button>
          <Button onClick={onSubmit}>
            Submit Quiz
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default QuizResults;

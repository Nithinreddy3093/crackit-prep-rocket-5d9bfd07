
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Timer } from 'lucide-react';

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
}

interface QuizQuestionProps {
  currentQuestion: Question;
  currentIndex: number;
  totalQuestions: number;
  selectedAnswer: string | null;
  onAnswerSelect: (answer: string) => void;
  onNextQuestion: () => void;
  elapsedTime: number;
  formatTime: (ms: number) => string;
  topicTitle?: string;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({
  currentQuestion,
  currentIndex,
  totalQuestions,
  selectedAnswer,
  onAnswerSelect,
  onNextQuestion,
  elapsedTime,
  formatTime,
  topicTitle
}) => {
  if (!currentQuestion) {
    return <div className="text-center text-white">Loading question...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">{topicTitle} Quiz</h1>
        <div className="flex items-center text-gray-300">
          <Timer className="mr-2 h-4 w-4" />
          <span>{formatTime(elapsedTime)}</span>
        </div>
      </div>
      
      <Card className="bg-darkBlue-800 border-darkBlue-700">
        <CardHeader>
          <CardTitle className="text-xl text-white">
            Question {currentIndex + 1} / {totalQuestions}
          </CardTitle>
          <CardDescription className="text-gray-400">
            Answer the question below
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-white text-lg">{currentQuestion.text}</p>
          <RadioGroup 
            defaultValue={selectedAnswer || ""} 
            onValueChange={onAnswerSelect} 
            className="w-full"
          >
            {currentQuestion.options.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem 
                  value={option} 
                  id={`answer-${option}`} 
                  className="peer h-4 w-4 shrink-0 rounded-full border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
                />
                <Label 
                  htmlFor={`answer-${option}`} 
                  className="cursor-pointer text-white peer-checked:text-primary"
                >
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>
      
      <Button 
        onClick={onNextQuestion} 
        className="w-full bg-primary hover:bg-primary/90 text-white"
      >
        {currentIndex === totalQuestions - 1 ? 'Finish Quiz' : 'Next Question'}
      </Button>
    </div>
  );
};

export default QuizQuestion;

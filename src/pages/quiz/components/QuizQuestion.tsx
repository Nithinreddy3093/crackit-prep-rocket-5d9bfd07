
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Timer } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

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

  const progressPercentage = ((currentIndex + 1) / totalQuestions) * 100;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in-up">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">{topicTitle} Quiz</h1>
        <div className="flex items-center text-gray-300 bg-darkBlue-800/50 px-3 py-1 rounded-full border border-darkBlue-700/50">
          <Timer className="mr-2 h-4 w-4" />
          <span>{formatTime(elapsedTime)}</span>
        </div>
      </div>
      
      <div className="flex items-center justify-between mb-2">
        <span className="text-white">Question {currentIndex + 1} of {totalQuestions}</span>
        <span className="text-primary">{Math.round(progressPercentage)}% Complete</span>
      </div>
      
      <Progress value={progressPercentage} className="h-2 mb-6" />
      
      <Card className="bg-darkBlue-800 border-darkBlue-700 shadow-lg animate-pulse-glow">
        <CardHeader>
          <CardTitle className="text-xl text-white">
            Question {currentIndex + 1}
          </CardTitle>
          <CardDescription className="text-gray-400">
            Select the best answer from the options below
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-white text-lg font-medium">{currentQuestion.text}</p>
          
          <RadioGroup 
            value={selectedAnswer || ""} 
            onValueChange={onAnswerSelect} 
            className="space-y-3"
          >
            {currentQuestion.options.map((option, index) => (
              <div 
                key={option} 
                className={`flex items-center space-x-3 p-3 rounded-lg border transition-all duration-300 ${
                  selectedAnswer === option 
                    ? 'border-primary bg-primary/10' 
                    : 'border-darkBlue-700 bg-darkBlue-800/50 hover:bg-darkBlue-700/50'
                }`}
              >
                <RadioGroupItem 
                  value={option} 
                  id={`answer-${option}`} 
                  className="text-primary" 
                />
                <Label 
                  htmlFor={`answer-${option}`} 
                  className={`cursor-pointer text-white flex-grow ${
                    selectedAnswer === option ? 'text-primary' : ''
                  }`}
                >
                  <span className="flex items-center">
                    <span className="bg-darkBlue-700 text-white w-6 h-6 rounded-full flex items-center justify-center mr-3 text-sm">
                      {String.fromCharCode(65 + index)}
                    </span>
                    {option}
                  </span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>
      
      <Button 
        onClick={onNextQuestion} 
        disabled={!selectedAnswer}
        className={`w-full py-6 text-lg font-medium transition-all duration-300 ${
          selectedAnswer 
            ? 'bg-primary hover:bg-primary/90 shadow-lg hover:shadow-primary/20' 
            : 'bg-darkBlue-700 cursor-not-allowed'
        }`}
      >
        {currentIndex === totalQuestions - 1 ? 'Finish Quiz' : 'Next Question'}
      </Button>
    </div>
  );
};

export default QuizQuestion;

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Clock, ChevronRight } from 'lucide-react';
import { SimpleQuestion } from '@/hooks/useSimpleQuiz';

interface SimpleQuizQuestionProps {
  question: SimpleQuestion;
  currentIndex: number;
  totalQuestions: number;
  selectedAnswer: string | null;
  onAnswerSelect: (answer: string) => void;
  onNextQuestion: () => void;
  elapsedTime: number;
  formatTime: (ms: number) => string;
  topicTitle?: string;
}

const SimpleQuizQuestion: React.FC<SimpleQuizQuestionProps> = ({
  question,
  currentIndex,
  totalQuestions,
  selectedAnswer,
  onAnswerSelect,
  onNextQuestion,
  elapsedTime,
  formatTime,
  topicTitle
}) => {
  const progressPercentage = Math.floor(((currentIndex + 1) / totalQuestions) * 100);

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="glass-card">
        <CardHeader>
          {/* Header with topic and timer */}
          <div className="flex justify-between items-center mb-4">
            <div className="text-white">
              <span className="text-sm font-light">Topic:</span>
              <h3 className="text-lg font-semibold">{topicTitle || 'Quiz'}</h3>
            </div>
            <div className="flex items-center space-x-1 text-white/90 bg-darkBlue-800/50 px-3 py-1 rounded-full">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-mono">{formatTime(elapsedTime)}</span>
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-white/80 text-sm">
              <span>Question {currentIndex + 1} of {totalQuestions}</span>
              <span>{progressPercentage}% Complete</span>
            </div>
            <div className="w-full bg-darkBlue-800/50 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300" 
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Question */}
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-white">{question.question_text}</h3>
          </div>

          {/* Answer Options */}
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => onAnswerSelect(option)}
                className={`w-full p-4 rounded-lg border transition-all text-left ${
                  selectedAnswer === option
                    ? 'bg-primary/20 border-primary/50 text-white'
                    : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/30 text-white'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-6 h-6 rounded-full mr-3 flex items-center justify-center text-xs ${
                    selectedAnswer === option ? 'bg-primary/30' : 'bg-darkBlue-800/70'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </div>
                  <div className="flex-grow">{option}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-4">
            <div className="text-sm text-white/60">
              ID: {question.id.slice(0, 8)}...
            </div>
            <Button 
              onClick={onNextQuestion}
              disabled={!selectedAnswer}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              {currentIndex === totalQuestions - 1 ? 'Finish Quiz' : 'Next Question'}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SimpleQuizQuestion;
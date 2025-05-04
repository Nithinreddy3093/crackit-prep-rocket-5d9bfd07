
import React from 'react';
import { Question } from '@/services/questionService';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuizQuestionProps {
  currentQuestion: Question;
  currentIndex: number;
  totalQuestions: number;
  selectedAnswer: number | null;
  onAnswerSelect: (answerIndex: number) => void; 
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
  const isAnswered = selectedAnswer !== null;
  const isCorrect = isAnswered && currentQuestion.options[selectedAnswer] === currentQuestion.correctAnswer;
  
  return (
    <div className="glass-card p-6 space-y-6 animate-fade-in">
      {/* Header with topic and timer */}
      <div className="flex justify-between items-center">
        <div className="text-white">
          <span className="text-sm font-light">Topic:</span>
          <h3 className="text-lg font-semibold">{topicTitle || 'General Knowledge'}</h3>
        </div>
        <div className="flex items-center space-x-1 text-white/90 bg-darkBlue-800/50 px-3 py-1 rounded-full">
          <Clock className="h-4 w-4" />
          <span className="text-sm font-mono">{formatTime(elapsedTime)}</span>
        </div>
      </div>
      
      {/* Question progress */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-white/80 text-sm">
          <span>Question {currentIndex + 1} of {totalQuestions}</span>
          <span>{Math.floor(((currentIndex) / totalQuestions) * 100)}% Complete</span>
        </div>
        <div className="w-full bg-darkBlue-800/50 rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300" 
            style={{ width: `${Math.floor(((currentIndex) / totalQuestions) * 100)}%` }}
          ></div>
        </div>
      </div>
      
      {/* Question */}
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-white">{currentQuestion.text}</h3>
        <div className="text-white/70 text-sm">{currentQuestion.explanation}</div>
      </div>
      
      {/* Answer options */}
      <div className="space-y-3">
        {currentQuestion.options.map((option, index) => (
          <div 
            key={index}
            onClick={() => !isAnswered && onAnswerSelect(index)}
            className={`
              p-4 rounded-lg border transition-all cursor-pointer
              ${isAnswered ? 'cursor-default' : 'hover:bg-white/5 hover:border-white/30'}
              ${selectedAnswer === index && isCorrect ? 'bg-green-500/20 border-green-500/50' : ''}
              ${selectedAnswer === index && !isCorrect ? 'bg-red-500/20 border-red-500/50' : ''}
              ${selectedAnswer !== index && option === currentQuestion.correctAnswer && isAnswered ? 'bg-green-500/10 border-green-500/30' : ''}
              ${selectedAnswer !== index && isAnswered ? 'opacity-50' : 'border-white/10 bg-white/5'}
            `}
          >
            <div className="flex items-center">
              <div className={`
                w-6 h-6 rounded-full mr-3 flex items-center justify-center text-xs
                ${selectedAnswer === index ? 'bg-white/20' : 'bg-darkBlue-800/70'}
              `}>
                {String.fromCharCode(65 + index)}
              </div>
              <div className="flex-grow">{option}</div>
              {isAnswered && (
                <div className="ml-2">
                  {option === currentQuestion.correctAnswer ? 
                    <CheckCircle className="h-5 w-5 text-green-400" /> : 
                    (selectedAnswer === index ? <AlertCircle className="h-5 w-5 text-red-400" /> : null)
                  }
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Feedback and next button */}
      {isAnswered && (
        <div className={`p-4 rounded-lg ${isCorrect ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'}`}>
          <div className="font-semibold mb-2 flex items-center">
            {isCorrect ? 
              <><CheckCircle className="h-4 w-4 mr-2 text-green-400" /> Correct!</> : 
              <><AlertCircle className="h-4 w-4 mr-2 text-red-400" /> Incorrect</>
            }
          </div>
          <p className="text-sm text-white/80">
            {currentQuestion.explanation || 
              (isCorrect ? 
                "Great job! That's the right answer." : 
                `The correct answer is "${currentQuestion.correctAnswer}".`
              )
            }
          </p>
        </div>
      )}
      
      <div className="flex justify-between pt-4">
        <div className="text-sm text-white/60">
          ID: {currentQuestion.id}
        </div>
        <Button 
          onClick={onNextQuestion}
          disabled={!isAnswered}
          className="bg-primary hover:bg-primary/90"
        >
          {currentIndex === totalQuestions - 1 ? 'Finish Quiz' : 'Next Question'}
        </Button>
      </div>
    </div>
  );
};

export default QuizQuestion;

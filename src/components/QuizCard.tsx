
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, ArrowRight, Loader2 } from 'lucide-react';

interface QuizCardProps {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  onNextQuestion: () => void;
  onCompleted: () => void;
  isLastQuestion: boolean;
  currentQuestion: number;
  totalQuestions: number;
}

const QuizCard: React.FC<QuizCardProps> = ({
  question,
  options,
  correctAnswer,
  explanation,
  onNextQuestion,
  onCompleted,
  isLastQuestion,
  currentQuestion,
  totalQuestions
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleOptionSelect = (index: number) => {
    if (showAnswer) return;
    setSelectedOption(index);
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null) {
      toast({
        title: "Select an option",
        description: "Please select an option before checking your answer",
        variant: "destructive"
      });
      return;
    }
    setShowAnswer(true);
  };

  const handleNext = () => {
    setSelectedOption(null);
    setShowAnswer(false);
    if (isLastQuestion) {
      setLoading(true);
      // Simulate API call for feedback
      setTimeout(() => {
        setLoading(false);
        onCompleted();
      }, 1500);
    } else {
      onNextQuestion();
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">Question {currentQuestion}/{totalQuestions}</h3>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-crackit-100 dark:bg-crackit-900 text-crackit-800 dark:text-crackit-200">
            Data Structures
          </span>
        </div>
        <h4 className="font-medium text-gray-900 dark:text-white text-lg mb-4">{question}</h4>
        <div className="space-y-3">
          {options.map((option, index) => (
            <div 
              key={index}
              onClick={() => handleOptionSelect(index)}
              className={`p-4 rounded-lg cursor-pointer transition-colors ${
                selectedOption === index 
                  ? showAnswer 
                    ? index === correctAnswer 
                      ? 'bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700' 
                      : 'bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700' 
                    : 'bg-crackit-100 dark:bg-crackit-900/30 border border-crackit-300 dark:border-crackit-700'
                  : 'bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 border border-transparent'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-gray-800 dark:text-gray-200">{option}</span>
                {showAnswer && selectedOption === index && (
                  index === correctAnswer 
                    ? <CheckCircle className="h-5 w-5 text-green-500" /> 
                    : <XCircle className="h-5 w-5 text-red-500" />
                )}
                {showAnswer && index === correctAnswer && selectedOption !== index && (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
              </div>
            </div>
          ))}
        </div>
        
        {showAnswer && (
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h5 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Explanation</h5>
            <p className="text-blue-700 dark:text-blue-300 text-sm">{explanation}</p>
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-100 dark:border-gray-700">
        <div className="flex-1">
          <div className="flex items-center">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-crackit-600 h-2 rounded-full" 
                style={{ width: `${((currentQuestion) / totalQuestions) * 100}%` }}
              ></div>
            </div>
            <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">{currentQuestion}/{totalQuestions}</span>
          </div>
        </div>
        
        {!showAnswer ? (
          <Button onClick={handleCheckAnswer} size="sm" className="bg-crackit-600 hover:bg-crackit-700">
            Check Answer
          </Button>
        ) : (
          <Button onClick={handleNext} size="sm" className="bg-crackit-600 hover:bg-crackit-700">
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : isLastQuestion ? (
              "Finish"
            ) : (
              <>Next <ArrowRight className="ml-1 h-4 w-4" /></>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuizCard;

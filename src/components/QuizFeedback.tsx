
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Brain, Target, BookOpen, BarChart2, CheckCircle, XCircle, ExternalLink } from 'lucide-react';

interface QuizFeedbackProps {
  score: number;
  totalQuestions: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: {
    title: string;
    type: 'video' | 'article' | 'practice';
    link: string;
  }[];
}

const QuizFeedback: React.FC<QuizFeedbackProps> = ({
  score,
  totalQuestions,
  strengths,
  weaknesses,
  recommendations
}) => {
  const navigate = useNavigate();
  const percentage = Math.round((score / totalQuestions) * 100);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
      <div className="p-6">
        <div className="mb-6 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-crackit-100 dark:bg-crackit-900 mb-4">
            <span className="text-2xl font-bold text-crackit-700 dark:text-crackit-300">{percentage}%</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Your Quiz Results
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            You scored {score} out of {totalQuestions} questions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
            <h4 className="flex items-center text-green-800 dark:text-green-200 font-medium mb-2">
              <CheckCircle className="h-5 w-5 mr-2" />
              Your Strengths
            </h4>
            <ul className="space-y-2">
              {strengths.map((strength, index) => (
                <li key={index} className="text-green-700 dark:text-green-300 text-sm flex items-start">
                  <span className="mr-2">•</span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
            <h4 className="flex items-center text-red-800 dark:text-red-200 font-medium mb-2">
              <XCircle className="h-5 w-5 mr-2" />
              Areas to Improve
            </h4>
            <ul className="space-y-2">
              {weaknesses.map((weakness, index) => (
                <li key={index} className="text-red-700 dark:text-red-300 text-sm flex items-start">
                  <span className="mr-2">•</span>
                  <span>{weakness}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mb-6">
          <h4 className="flex items-center text-gray-900 dark:text-white font-medium mb-3">
            <Brain className="h-5 w-5 mr-2 text-crackit-600 dark:text-crackit-400" />
            AI-Powered Recommendations
          </h4>
          <div className="space-y-3">
            {recommendations.map((rec, index) => (
              <a 
                key={index} 
                href={rec.link}
                target="_blank"
                rel="noopener noreferrer" 
                className="flex items-start p-3 bg-gray-50 dark:bg-gray-700/40 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/60 transition-colors"
              >
                {rec.type === 'video' && <BookOpen className="h-5 w-5 mr-3 text-blue-500 flex-shrink-0 mt-0.5" />}
                {rec.type === 'article' && <Target className="h-5 w-5 mr-3 text-purple-500 flex-shrink-0 mt-0.5" />}
                {rec.type === 'practice' && <BarChart2 className="h-5 w-5 mr-3 text-green-500 flex-shrink-0 mt-0.5" />}
                <div className="flex-1">
                  <p className="text-gray-900 dark:text-white text-sm font-medium">{rec.title}</p>
                  <p className="text-gray-500 dark:text-gray-400 text-xs mt-1 flex items-center">
                    {rec.type === 'video' && 'Video tutorial'}
                    {rec.type === 'article' && 'Article'}
                    {rec.type === 'practice' && 'Practice exercises'}
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 p-4 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-100 dark:border-gray-700">
        <Button
          onClick={() => navigate('/topics')}
          className="bg-crackit-600 hover:bg-crackit-700"
        >
          Try Another Topic
        </Button>
        <Button
          variant="outline"
          onClick={() => navigate('/')}
          className="border-crackit-600 text-crackit-600 hover:bg-crackit-50 dark:border-crackit-400 dark:text-crackit-400 dark:hover:bg-crackit-950/30"
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
};

export default QuizFeedback;

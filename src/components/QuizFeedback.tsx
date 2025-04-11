
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Brain, Target, BookOpen, BarChart2, CheckCircle, XCircle, ExternalLink, Loader2 } from 'lucide-react';
import { generateAIFeedback, AIFeedback, QuizResult } from '@/services/geminiService';

interface QuizFeedbackProps {
  score: number;
  totalQuestions: number;
  correctQuestions: number[];
  incorrectQuestions: number[];
  topic: string;
}

const QuizFeedback: React.FC<QuizFeedbackProps> = ({
  score,
  totalQuestions,
  correctQuestions,
  incorrectQuestions,
  topic
}) => {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState<AIFeedback | null>(null);
  const [loading, setLoading] = useState(true);
  const percentage = Math.round((score / totalQuestions) * 100);

  useEffect(() => {
    const fetchFeedback = async () => {
      setLoading(true);
      try {
        const quizResult: QuizResult = {
          score,
          totalQuestions,
          correctAnswers: correctQuestions,
          wrongAnswers: incorrectQuestions,
          topic
        };
        
        const result = await generateAIFeedback(quizResult);
        setFeedback(result);
      } catch (error) {
        console.error('Error getting AI feedback:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, [score, totalQuestions, correctQuestions, incorrectQuestions, topic]);

  if (loading) {
    return (
      <div className="bg-card dark:bg-darkBlue-900/50 rounded-xl shadow-md overflow-hidden text-center p-10">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Loader2 className="h-12 w-12 text-primary animate-spin" />
          <h3 className="text-xl font-semibold text-foreground">
            Analyzing your results with AI...
          </h3>
          <p className="text-muted-foreground">
            Our AI is generating personalized feedback based on your performance. This will take just a moment.
          </p>
        </div>
      </div>
    );
  }

  if (!feedback) {
    return (
      <div className="bg-card dark:bg-darkBlue-900/50 rounded-xl shadow-md overflow-hidden text-center p-10">
        <div className="flex flex-col items-center justify-center space-y-4">
          <XCircle className="h-12 w-12 text-destructive" />
          <h3 className="text-xl font-semibold text-foreground">
            Unable to generate feedback
          </h3>
          <p className="text-muted-foreground">
            We couldn't generate AI feedback at this time. Please try again later.
          </p>
          <Button 
            onClick={() => navigate('/topics')}
            className="bg-primary hover:bg-primary/90"
          >
            Back to Topics
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card dark:bg-darkBlue-900/50 rounded-xl shadow-md overflow-hidden">
      <div className="p-6">
        <div className="mb-6 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 dark:bg-primary/20 mb-4">
            <span className="text-2xl font-bold text-primary">{percentage}%</span>
          </div>
          <h3 className="text-xl font-semibold text-foreground">
            Your Quiz Results
          </h3>
          <p className="text-muted-foreground mt-1">
            You scored {score} out of {totalQuestions} questions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-green-500/10 dark:bg-green-500/5 p-4 rounded-lg border border-green-500/20">
            <h4 className="flex items-center text-green-600 dark:text-green-400 font-medium mb-2">
              <CheckCircle className="h-5 w-5 mr-2" />
              Your Strengths
            </h4>
            <ul className="space-y-2">
              {feedback.strengths.map((strength, index) => (
                <li key={index} className="text-green-600 dark:text-green-400 text-sm flex items-start">
                  <span className="mr-2">•</span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-red-500/10 dark:bg-red-500/5 p-4 rounded-lg border border-red-500/20">
            <h4 className="flex items-center text-red-600 dark:text-red-400 font-medium mb-2">
              <XCircle className="h-5 w-5 mr-2" />
              Areas to Improve
            </h4>
            <ul className="space-y-2">
              {feedback.weaknesses.map((weakness, index) => (
                <li key={index} className="text-red-600 dark:text-red-400 text-sm flex items-start">
                  <span className="mr-2">•</span>
                  <span>{weakness}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mb-6">
          <h4 className="flex items-center text-foreground font-medium mb-3">
            <Brain className="h-5 w-5 mr-2 text-primary" />
            AI-Powered Recommendations
          </h4>
          <div className="space-y-3">
            {feedback.recommendations.map((rec, index) => (
              <a 
                key={index} 
                href={rec.link}
                target="_blank"
                rel="noopener noreferrer" 
                className="flex items-start p-3 bg-background hover:bg-muted transition-colors rounded-lg"
              >
                {rec.type === 'video' && <BookOpen className="h-5 w-5 mr-3 text-blue-500 flex-shrink-0 mt-0.5" />}
                {rec.type === 'article' && <Target className="h-5 w-5 mr-3 text-purple-500 flex-shrink-0 mt-0.5" />}
                {rec.type === 'practice' && <BarChart2 className="h-5 w-5 mr-3 text-green-500 flex-shrink-0 mt-0.5" />}
                <div className="flex-1">
                  <p className="text-foreground text-sm font-medium">{rec.title}</p>
                  <p className="text-muted-foreground text-xs mt-1 flex items-center">
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

      <div className="flex flex-col sm:flex-row gap-3 p-4 bg-muted/50 border-t border-border">
        <Button
          onClick={() => navigate('/topics')}
          className="bg-primary hover:bg-primary/90"
        >
          Try Another Topic
        </Button>
        <Button
          variant="outline"
          onClick={() => navigate('/dashboard')}
          className="border-border text-primary hover:bg-primary/10"
        >
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default QuizFeedback;

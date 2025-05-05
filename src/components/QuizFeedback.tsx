
import React, { useEffect, useState } from 'react';
import { generateAIFeedback, AIFeedback, QuizResult } from '@/services/geminiService';
import { updateUserPerformance } from '@/services/performance';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import LoadingState from './quiz/LoadingState';
import ErrorState from './quiz/ErrorState';
import ScoreHeader from './quiz/ScoreHeader';
import FeedbackSection from './quiz/FeedbackSection';
import RecommendationsSection from './quiz/RecommendationsSection';
import ActionButtons from './quiz/ActionButtons';

interface QuizFeedbackProps {
  score: number;
  totalQuestions: number;
  correctQuestions: number[];
  incorrectQuestions: number[];
  topic: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

const QuizFeedback: React.FC<QuizFeedbackProps> = ({
  score,
  totalQuestions,
  correctQuestions,
  incorrectQuestions,
  topic,
  difficulty = 'intermediate'
}) => {
  const { user } = useAuth();
  const [feedback, setFeedback] = useState<AIFeedback | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingProgress, setSavingProgress] = useState(false);
  const [progressSaved, setProgressSaved] = useState(false);
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
        
        if (user) {
          setSavingProgress(true);
          await updateUserPerformance(user.id, topic, percentage);
          setProgressSaved(true);
          
          toast({
            title: "Progress Saved",
            description: `Your ${topic} quiz results have been saved to your profile.`,
            variant: "default",
          });
        }
      } catch (error) {
        console.error('Error getting AI feedback:', error);
      } finally {
        setLoading(false);
        setSavingProgress(false);
      }
    };

    fetchFeedback();
  }, [score, totalQuestions, correctQuestions, incorrectQuestions, topic, user, percentage]);

  if (loading) {
    return <LoadingState />;
  }

  if (!feedback) {
    return <ErrorState />;
  }

  return (
    <div className="bg-card dark:bg-darkBlue-900/50 rounded-xl shadow-md overflow-hidden">
      <div className="p-6">
        <ScoreHeader
          percentage={percentage}
          score={score}
          totalQuestions={totalQuestions}
          savingProgress={savingProgress}
          progressSaved={progressSaved}
          isAuthenticated={!!user}
        />
        
        <FeedbackSection
          strengths={feedback.strengths}
          weaknesses={feedback.weaknesses}
        />

        <RecommendationsSection
          recommendations={feedback.recommendations}
        />
      </div>

      <ActionButtons />
    </div>
  );
};

export default QuizFeedback;

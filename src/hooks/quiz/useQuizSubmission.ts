
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "@/components/ui/use-toast";
import { submitQuizResult } from "@/services/performance/quizResultsService";
import { updateUserPerformance } from "@/services/performance";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from '@tanstack/react-query';

export interface QuizSubmissionData {
  userId: string;
  topicTitle: string;
  correctAnswers: number;
  totalQuestions: number;
  timeInMs: number;
  questionDetails?: {
    questionId: string;
    question: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
  }[];
}

export function useQuizSubmission() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const queryClient = useQueryClient();

  const submitQuiz = useCallback(async (quizData: QuizSubmissionData) => {
    try {
      if (isSubmitted) {
        toast({
          title: "Quiz already submitted",
          description: "Your quiz results have already been recorded.",
          variant: "default",
        });
        return;
      }
      
      setIsSubmitting(true);
      const { 
        userId, 
        topicTitle, 
        correctAnswers, 
        totalQuestions, 
        timeInMs,
        questionDetails 
      } = quizData;
      
      if (!userId) {
        throw new Error("User ID is required to submit quiz results");
      }
      
      const quizTopic = topicTitle || 'General';
      const quizScore = Math.round((correctAnswers / totalQuestions) * 100);
      const completionTime = Math.floor(timeInMs / 1000); // convert ms to seconds
      
      // Calculate analytics
      const skipped = questionDetails?.filter(q => q.userAnswer === '').length || 0;
      const incorrect = questionDetails?.filter(q => !q.isCorrect && q.userAnswer !== '').length || 0;
      
      // Create detailed quiz result record
      const quizResult = {
        user_id: userId,
        topic: quizTopic,
        score: quizScore,
        total_questions: totalQuestions,
        correct_answers: correctAnswers,
        incorrect_answers: incorrect,
        skipped_questions: skipped,
        accuracy: quizScore,
        completion_time: completionTime
      };
      
      console.log('Submitting quiz result:', quizResult);
      
      // Submit to quiz_results table
      const submitted = await submitQuizResult(quizResult);
      
      if (!submitted) {
        throw new Error("Failed to save quiz results to database");
      }
      
      // Also update the user's performance metrics in Supabase
      const performanceData = await updateUserPerformance(userId, quizTopic, quizScore, completionTime);
      
      console.log('Updated performance data:', performanceData);
      
      // Clear any stored in-progress quiz data
      localStorage.removeItem('inProgressQuiz');
      localStorage.removeItem(`quiz_progress_${quizTopic}`);
      localStorage.removeItem('lastQuizResults');
      
      setIsSubmitted(true);
      
      // Force invalidate and refetch all relevant queries to ensure dashboard is updated
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['userPerformance'] }),
        queryClient.invalidateQueries({ queryKey: ['performanceHistory'] }),
        queryClient.invalidateQueries({ queryKey: ['quizResults'] }),
        queryClient.invalidateQueries({ queryKey: ['topicScores'] }),
        queryClient.invalidateQueries({ queryKey: ['aiRecommendations'] }),
        queryClient.invalidateQueries({ queryKey: ['userActivities'] }),
        queryClient.invalidateQueries({ queryKey: ['userBadges'] })
      ]);
      
      toast({
        title: "Quiz Submitted Successfully",
        description: `Your score of ${quizScore}% has been recorded.`,
        variant: "default",
      });
      
      // Navigate to dashboard after short delay to allow toast to be seen
      setTimeout(() => {
        navigate('/dashboard', { 
          state: { 
            refreshData: true,
            quizCompleted: true, 
            topic: quizTopic,
            score: quizScore
          } 
        });
      }, 1000);
      
      return true;
    } catch (error: any) {
      console.error("Error submitting quiz:", error);
      toast({
        title: "Error submitting quiz",
        description: error.message || "Failed to submit the quiz. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitted, navigate, queryClient]);

  return { submitQuiz, isSubmitting, isSubmitted };
}

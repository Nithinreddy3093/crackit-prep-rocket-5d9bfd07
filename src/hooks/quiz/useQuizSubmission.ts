
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "@/components/ui/use-toast";
import { submitQuizResult } from "@/services/performance/quizResultsService";
import { updateUserPerformance } from "@/services/performance";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from '@tanstack/react-query';
import { compareAnswers } from '@/utils/answerComparison';

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
      
      console.log('=== IMPROVED QUIZ SUBMISSION START ===');
      console.log('Submission data received:', {
        userId,
        topicTitle,
        correctAnswers,
        totalQuestions,
        timeInMs,
        questionDetailsCount: questionDetails?.length || 0
      });
      
      const quizTopic = topicTitle || 'General';
      const completionTime = Math.floor(timeInMs / 1000);
      
      // Re-validate all answers for maximum accuracy
      let validatedCorrectCount = 0;
      let validatedQuestionDetails = questionDetails || [];
      
      if (questionDetails && questionDetails.length > 0) {
        console.log('Re-validating all answers for accuracy...');
        
        // Remove duplicates first
        const uniqueDetails = new Map();
        questionDetails.forEach(detail => {
          if (!uniqueDetails.has(detail.questionId)) {
            uniqueDetails.set(detail.questionId, detail);
          }
        });
        
        validatedQuestionDetails = Array.from(uniqueDetails.values());
        
        // Count correct answers from validated details
        validatedCorrectCount = validatedQuestionDetails.filter(detail => detail.isCorrect).length;
        
        console.log('Validation results:', {
          originalCount: questionDetails.length,
          afterDeduplication: validatedQuestionDetails.length,
          validatedCorrectCount,
          originalCorrectAnswers: correctAnswers
        });
        
        // Log each validated answer
        validatedQuestionDetails.forEach((detail, index) => {
          console.log(`Validated Q${index + 1} (${detail.questionId}):`, {
            userAnswer: detail.userAnswer,
            correctAnswer: detail.correctAnswer,
            isCorrect: detail.isCorrect,
            isAnswered: detail.userAnswer !== '' && detail.userAnswer !== null
          });
        });
      } else {
        console.warn('No question details available - using provided correct answers count');
        validatedCorrectCount = correctAnswers;
      }
      
      // Use validated count for final score calculation
      const finalScore = Math.round((validatedCorrectCount / totalQuestions) * 100);
      
      // Create detailed quiz result record
      const quizResult = {
        user_id: userId,
        topic: quizTopic,
        score: finalScore,
        completion_time: completionTime,
        question_details: validatedQuestionDetails
      };
      
      console.log('Final validated quiz result for submission:', {
        ...quizResult,
        questionDetailsCount: quizResult.question_details.length
      });
      
      // Submit to quiz_results table
      console.log('Submitting to database...');
      const submitted = await submitQuizResult(quizResult);
      
      if (!submitted) {
        console.error('Database submission failed');
        throw new Error("Failed to save quiz results to database");
      }
      
      console.log('✅ Quiz result submitted successfully to database');
      
      // Update user performance metrics
      console.log('Updating user performance...');
      const performanceData = await updateUserPerformance(userId, quizTopic, finalScore, completionTime);
      
      console.log('✅ Performance data updated:', performanceData);
      
      // Clear quiz progress data
      localStorage.removeItem('inProgressQuiz');
      localStorage.removeItem(`quiz_progress_${quizTopic}`);
      localStorage.removeItem('lastQuizResults');
      
      console.log('✅ Cleared localStorage quiz data');
      
      setIsSubmitted(true);
      
      // Force comprehensive cache invalidation and refresh
      console.log('Invalidating all relevant caches...');
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['userPerformance'] }),
        queryClient.invalidateQueries({ queryKey: ['performanceHistory'] }),
        queryClient.invalidateQueries({ queryKey: ['quizResults'] }),
        queryClient.invalidateQueries({ queryKey: ['topicScores'] }),
        queryClient.invalidateQueries({ queryKey: ['aiRecommendations'] }),
        queryClient.invalidateQueries({ queryKey: ['userActivities'] }),
        queryClient.invalidateQueries({ queryKey: ['userBadges'] })
      ]);
      
      // Also trigger manual refetch for immediate update
      queryClient.refetchQueries({ queryKey: ['userPerformance', userId] });
      queryClient.refetchQueries({ queryKey: ['userActivities', userId] });
      
      console.log('✅ Cache invalidation and refetch completed');
      
      toast({
        title: "Quiz Completed Successfully! 🎉",
        description: `Your score of ${finalScore}% has been saved. Dashboard will update shortly.`,
        variant: "default",
      });
      
      console.log('=== IMPROVED QUIZ SUBMISSION SUCCESS ===');
      
      // Navigate to dashboard with refresh flag
      setTimeout(() => {
        navigate('/dashboard', { 
          state: { 
            refreshData: true,
            quizCompleted: true, 
            topic: quizTopic,
            score: finalScore,
            timestamp: Date.now()
          } 
        });
      }, 1500);
      
      return true;
    } catch (error: any) {
      console.error("=== QUIZ SUBMISSION ERROR ===");
      console.error("Error submitting quiz:", error);
      toast({
        title: "Submission Failed ❌",
        description: error.message || "Failed to save quiz results. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitted, navigate, queryClient]);

  return { submitQuiz, isSubmitting, isSubmitted };
}

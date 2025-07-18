
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
      
      console.log('=== QUIZ SUBMISSION START ===');
      console.log('Submission data received:', {
        userId,
        topicTitle,
        correctAnswers,
        totalQuestions,
        timeInMs,
        questionDetailsCount: questionDetails?.length || 0
      });
      
      const quizTopic = topicTitle || 'General';
      const quizScore = Math.round((correctAnswers / totalQuestions) * 100);
      const completionTime = Math.floor(timeInMs / 1000); // convert ms to seconds
      
      // Calculate accurate analytics from question details with improved comparison
      let skipped = 0;
      let incorrect = 0;
      let attempted = 0;
      let actualCorrect = 0;
      
      if (questionDetails && questionDetails.length > 0) {
        console.log('Using question details for accurate calculation');
        
        // Re-validate each answer with proper comparison
        const validatedDetails = questionDetails.map(detail => {
          const isAnswered = detail.userAnswer !== '' && detail.userAnswer !== null;
          let actualCorrectAnswer = detail.correctAnswer;
          
          // Check if correctAnswer is an index or the actual text
          if (typeof detail.correctAnswer === 'number' || !isNaN(Number(detail.correctAnswer))) {
            console.warn('CorrectAnswer appears to be an index in submission:', detail.correctAnswer, 'for question:', detail.questionId);
            // If this happens, we need to get the actual text from somewhere
            // For now, use the original value but this indicates a data structure issue
          }
          
          // Normalize answers for accurate comparison
          const normalizedUserAnswer = detail.userAnswer?.trim().toLowerCase() || '';
          const normalizedCorrectAnswer = actualCorrectAnswer?.trim().toLowerCase() || '';
          const isCorrectCalculated = isAnswered && normalizedUserAnswer === normalizedCorrectAnswer;
          
          return {
            ...detail,
            isCorrect: isCorrectCalculated,
            isAnswered
          };
        });
        
        const answeredQuestions = validatedDetails.filter(q => q.isAnswered);
        attempted = answeredQuestions.length;
        actualCorrect = validatedDetails.filter(q => q.isCorrect).length;
        incorrect = attempted - actualCorrect;
        skipped = totalQuestions - attempted;
        
        console.log('Detailed analytics calculation:', {
          totalQuestions,
          questionDetailsProvided: questionDetails.length,
          validatedDetails: validatedDetails.length,
          attempted,
          actualCorrect,
          incorrect,
          skipped
        });
        
        // Log each answer for debugging
        validatedDetails.forEach((detail, index) => {
          console.log(`Q${index + 1} (${detail.questionId}):`, {
            userAnswer: detail.userAnswer,
            correctAnswer: detail.correctAnswer,
            isCorrect: detail.isCorrect,
            isAnswered: detail.isAnswered
          });
        });
        
        // Always use the calculated value for accuracy
        console.log('Using calculated correct answers for submission:', actualCorrect);
      } else {
        console.warn('No question details available - using fallback calculation');
        attempted = totalQuestions;
        actualCorrect = correctAnswers;
        incorrect = totalQuestions - correctAnswers;
        skipped = 0;
        
        console.log('Fallback analytics calculation:', {
          totalQuestions,
          attempted,
          actualCorrect,
          incorrect,
          skipped
        });
      }
      
      // Create detailed quiz result record for the quiz_results table
      const quizResult = {
        user_id: userId,
        topic: quizTopic,
        score: Math.round((actualCorrect / totalQuestions) * 100),
        completion_time: completionTime,
        question_details: questionDetails || []
      };
      
      console.log('Final quiz result for submission:', quizResult);
      
      // Submit to quiz_results table
      console.log('About to submit quiz result to database...');
      const submitted = await submitQuizResult(quizResult);
      
      if (!submitted) {
        console.error('Database submission failed');
        throw new Error("Failed to save quiz results to database");
      }
      
      console.log('✅ Quiz result submitted successfully to database');
      
      // Also update the user's performance metrics in Supabase
      const performanceData = await updateUserPerformance(userId, quizTopic, quizResult.score, completionTime);
      
      console.log('Updated performance data:', performanceData);
      
      // Clear any stored in-progress quiz data
      localStorage.removeItem('inProgressQuiz');
      localStorage.removeItem(`quiz_progress_${quizTopic}`);
      localStorage.removeItem('lastQuizResults');
      
      console.log('Cleared localStorage quiz data');
      
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
      
      console.log('Invalidated all relevant queries');
      
      toast({
        title: "Quiz Saved Successfully ✅",
        description: `Your score of ${quizResult.score}% has been saved to your profile.`,
        variant: "default",
      });
      
      console.log('=== QUIZ SUBMISSION SUCCESS ===');
      
      // Navigate to dashboard after short delay to allow toast to be seen
      setTimeout(() => {
        navigate('/dashboard', { 
          state: { 
            refreshData: true,
            quizCompleted: true, 
            topic: quizTopic,
            score: quizResult.score
          } 
        });
      }, 1000);
      
      return true;
    } catch (error: any) {
      console.error("=== QUIZ SUBMISSION ERROR ===");
      console.error("Error submitting quiz:", error);
      toast({
        title: "Failed to Save ❌",
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

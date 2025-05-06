
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "@/components/ui/use-toast";
import { updateUserPerformance } from "@/services/performance";
import { supabase } from "@/integrations/supabase/client";

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

  const submitQuiz = async (quizData: QuizSubmissionData) => {
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
      
      // Prepare analytics data
      const analyticsData = {
        correct: correctAnswers,
        incorrect: incorrect,
        skipped: skipped,
        accuracy: quizScore,
        timePerQuestion: Math.round(completionTime / totalQuestions),
      };
      
      console.log('Submitting quiz results:', {
        quizTopic,
        quizScore,
        completionTime,
        analyticsData
      });
      
      // Save detailed quiz results
      const { error: quizResultError } = await supabase
        .from('quiz_results')
        .insert({
          user_id: userId,
          topic: quizTopic,
          score: quizScore,
          completion_time: completionTime,
          question_details: questionDetails || [],
          date: new Date().toISOString()
        });
      
      if (quizResultError) {
        console.error("Error saving quiz details:", quizResultError);
        throw new Error(`Failed to save quiz results: ${quizResultError.message}`);
      }
      
      // Update the user's performance metrics in Supabase
      const performanceData = await updateUserPerformance(userId, quizTopic, quizScore, completionTime);
      
      console.log('Updated performance data:', performanceData);
      
      // Clear any stored in-progress quiz data
      localStorage.removeItem('inProgressQuiz');
      localStorage.removeItem(`quiz_progress_${quizTopic}`);
      
      setIsSubmitted(true);
      
      toast({
        title: "Quiz Submitted Successfully",
        description: `Your score of ${quizScore}% has been recorded.`,
        variant: "default",
      });
      
      // Navigate to dashboard after short delay to allow toast to be seen
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
      
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
  };

  return { submitQuiz, isSubmitting, isSubmitted };
}

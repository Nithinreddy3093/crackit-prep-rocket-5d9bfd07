
import { useNavigate } from 'react-router-dom';
import { toast } from "@/components/ui/use-toast";
import { updateUserPerformance } from "@/services/supabasePerformanceService";
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

  const submitQuiz = async (quizData: QuizSubmissionData) => {
    try {
      const { 
        userId, 
        topicTitle, 
        correctAnswers, 
        totalQuestions, 
        timeInMs,
        questionDetails 
      } = quizData;
      
      if (userId) {
        const quizTopic = topicTitle || 'General';
        const quizScore = Math.round((correctAnswers / totalQuestions) * 100);
        const completionTime = Math.floor(timeInMs / 1000); // convert ms to seconds
        
        // Save detailed quiz results
        const { data: quizResultData, error: quizResultError } = await supabase
          .from('quiz_results')
          .insert([{
            user_id: userId,
            topic: quizTopic,
            score: quizScore,
            completion_time: completionTime,
            question_details: questionDetails || [],
            date: new Date().toISOString()
          }]);
        
        if (quizResultError) {
          console.error("Error saving quiz details:", quizResultError);
        }
        
        // Update the user's performance in Supabase
        await updateUserPerformance(userId, quizTopic, quizScore, completionTime);
      }
      
      toast({
        title: "Quiz Submitted",
        description: "Your quiz has been submitted and your score has been recorded.",
        variant: "default",
      });
      navigate('/dashboard');
    } catch (error: any) {
      console.error("Error submitting quiz:", error);
      toast({
        title: "Error submitting quiz",
        description: error.message || "Failed to submit the quiz. Please try again.",
        variant: "destructive",
      });
    }
  };

  return { submitQuiz };
}

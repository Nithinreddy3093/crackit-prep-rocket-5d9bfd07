
import { useNavigate } from 'react-router-dom';
import { toast } from "@/components/ui/use-toast";
import { updateUserPerformance } from "@/services/supabasePerformanceService";

export function useQuizSubmission() {
  const navigate = useNavigate();

  const submitQuiz = async (
    userId: string | undefined, 
    topicTitle: string | undefined,
    correctAnswers: number, 
    totalQuestions: number, 
    timeInMs: number
  ) => {
    try {
      if (userId) {
        const quizTopic = topicTitle || 'General';
        const quizScore = Math.round((correctAnswers / totalQuestions) * 100);
        const completionTime = Math.floor(timeInMs / 1000); // convert ms to seconds
        
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

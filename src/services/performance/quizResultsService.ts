
import { supabase } from "@/integrations/supabase/client";
import { QuizResult } from "./types";

// Get recent quiz details
export const getRecentQuizDetails = async (userId: string): Promise<QuizResult[]> => {
  try {
    // Use a type assertion to handle the quiz_results table
    const { data, error } = await supabase
      .from('quiz_results' as any)
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .limit(5);

    if (error) {
      console.error('Error fetching quiz results:', error);
      return [];
    }

    // Assert the data type
    return (data as unknown[] as QuizResult[]) || [];
  } catch (error) {
    console.error('Error in getRecentQuizDetails:', error);
    return [];
  }
};

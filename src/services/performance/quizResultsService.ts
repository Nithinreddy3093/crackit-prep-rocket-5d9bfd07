
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

// Define the QuizResult type that matches our Supabase quiz_results table structure
export interface QuizResult {
  id?: string;
  user_id: string;
  topic: string;
  score: number;
  completion_time?: number;
  question_details?: any[]; // Array of question detail objects
  date?: string;
}

// Helper function to safely convert Json to question details array
const parseQuestionDetails = (questionDetails: Json | null): any[] => {
  if (!questionDetails) return [];
  
  // If it's already an array, return it
  if (Array.isArray(questionDetails)) {
    return questionDetails;
  }
  
  // If it's a string, try to parse it as JSON
  if (typeof questionDetails === 'string') {
    try {
      const parsed = JSON.parse(questionDetails);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  
  // For other types, return empty array
  return [];
};

// Get quiz results for a user
export const getUserQuizResults = async (userId: string): Promise<QuizResult[]> => {
  try {
    const { data, error } = await supabase
      .from('quiz_results')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching quiz results:', error);
      return [];
    }

    // Transform the data to match the QuizResult interface
    return (data || []).map(item => ({
      id: item.id,
      user_id: item.user_id,
      topic: item.topic,
      score: item.score,
      completion_time: item.completion_time || 0,
      date: item.date,
      question_details: parseQuestionDetails(item.question_details)
    }));
  } catch (error) {
    console.error('Error in getUserQuizResults:', error);
    return [];
  }
};

// Get recent quiz results with limit
export const getRecentQuizResults = async (userId: string, limit: number = 5): Promise<QuizResult[]> => {
  try {
    const { data, error } = await supabase
      .from('quiz_results')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching recent quiz results:', error);
      return [];
    }

    // Transform the data to match the QuizResult interface
    return (data || []).map(item => ({
      id: item.id,
      user_id: item.user_id,
      topic: item.topic,
      score: item.score,
      completion_time: item.completion_time || 0,
      date: item.date,
      question_details: parseQuestionDetails(item.question_details)
    }));
  } catch (error) {
    console.error('Error in getRecentQuizResults:', error);
    return [];
  }
};

// Submit new quiz result
export const submitQuizResult = async (quizResult: QuizResult): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('quiz_results')
      .insert([quizResult]);

    if (error) {
      console.error('Error submitting quiz result:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in submitQuizResult:', error);
    return false;
  }
};

// Get quiz performance summary by topic
export const getQuizPerformanceByTopic = async (userId: string): Promise<Record<string, { accuracy: number, attempts: number }>> => {
  try {
    const { data, error } = await supabase
      .from('quiz_results')
      .select('topic, score')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching topic performance:', error);
      return {};
    }

    // Group by topic and calculate average accuracy
    const topicPerformance: Record<string, { accuracy: number, attempts: number }> = {};
    
    if (data) {
      data.forEach(item => {
        if (!topicPerformance[item.topic]) {
          topicPerformance[item.topic] = { accuracy: 0, attempts: 0 };
        }
        
        topicPerformance[item.topic].accuracy += item.score;
        topicPerformance[item.topic].attempts += 1;
      });
      
      // Calculate averages
      Object.keys(topicPerformance).forEach(topic => {
        const { accuracy, attempts } = topicPerformance[topic];
        topicPerformance[topic].accuracy = accuracy / attempts;
      });
    }

    return topicPerformance;
  } catch (error) {
    console.error('Error in getQuizPerformanceByTopic:', error);
    return {};
  }
};

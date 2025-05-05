
import { supabase } from "@/integrations/supabase/client";
import { LearningResource } from "./types";
import { getUserPerformance } from "./userPerformanceService";

// Get suggested resources based on user performance
export const getSuggestedResources = async (userId: string): Promise<LearningResource[]> => {
  try {
    // Get user performance first to identify weak topics
    const performance = await getUserPerformance(userId);
    
    if (!performance || !performance.weakTopics.length) {
      // Fallback to generic resources if no weak topics
      const { data, error } = await supabase
        .from('learning_resources')
        .select('*')
        .limit(5);
        
      if (error) {
        console.error('Error fetching resources:', error);
        return [];
      }
      
      return data;
    }
    
    // Get resources for weak topics
    const { data, error } = await supabase
      .from('learning_resources')
      .select('*')
      .in('topic', performance.weakTopics)
      .limit(5);
      
    if (error) {
      console.error('Error fetching resources for weak topics:', error);
      return [];
    }
    
    return data;
  } catch (error) {
    console.error('Error in getSuggestedResources:', error);
    return [];
  }
};


import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { UserPerformance, PerformanceHistory } from "./types";
import { checkAndAwardBadges, initializeUserBadges } from "./badgeService";

// Get user performance data
export const getUserPerformance = async (userId: string): Promise<UserPerformance | null> => {
  try {
    // Get overall performance
    const { data: performanceData, error: performanceError } = await supabase
      .from('user_performance')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (performanceError) {
      console.error('Error fetching user performance:', performanceError);
      return null;
    }

    // Get topic scores
    const { data: topicScoresData, error: topicScoresError } = await supabase
      .from('topic_scores')
      .select('*')
      .eq('user_id', userId);

    if (topicScoresError) {
      console.error('Error fetching topic scores:', topicScoresError);
      return null;
    }

    // Get performance history for average completion time
    const { data: historyData, error: historyError } = await supabase
      .from('performance_history')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .limit(10);
      
    if (historyError) {
      console.error('Error fetching performance history:', historyError);
    }

    // Calculate average completion time
    let avgCompletionTime = 0;
    const validCompletionTimes = historyData?.filter(item => item.completion_time) || [];
    
    if (validCompletionTimes.length > 0) {
      avgCompletionTime = validCompletionTimes.reduce(
        (sum, item) => sum + (item.completion_time || 0), 0
      ) / validCompletionTimes.length;
    }

    // Create topic scores map
    const topicScores: Record<string, number> = {};
    topicScoresData?.forEach(item => {
      topicScores[item.topic] = item.score;
    });

    // Create accuracy per topic map
    const accuracyPerTopic: Record<string, number> = {};
    topicScoresData?.forEach(item => {
      accuracyPerTopic[item.topic] = item.score;
    });

    // Get recent subjects (last 5 unique topics)
    const recentSubjects = [...new Set((historyData || []).map(item => item.topic))].slice(0, 5);

    // Sort topics by score to determine strong and weak topics
    const sortedTopics = [...(topicScoresData || [])].sort((a, b) => b.score - a.score);
    const strongTopics = sortedTopics.slice(0, 2).map(item => item.topic);
    const weakTopics = [...sortedTopics].reverse().slice(0, 2).map(item => item.topic);

    return {
      userId,
      overallScore: performanceData?.overall_score || 0,
      topicScores,
      quizzesTaken: performanceData?.quizzes_taken || 0,
      lastQuizDate: performanceData?.last_quiz_date || new Date().toISOString(),
      strongTopics,
      weakTopics,
      averageCompletionTime: Math.round(avgCompletionTime),
      recentSubjects,
      accuracyPerTopic
    };
  } catch (error) {
    console.error('Error in getUserPerformance:', error);
    return null;
  }
};

// Get performance history
export const getPerformanceHistory = async (userId: string): Promise<PerformanceHistory[]> => {
  try {
    const { data, error } = await supabase
      .from('performance_history')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching performance history:', error);
      return [];
    }

    return data.map(item => ({
      date: item.date,
      topic: item.topic,
      score: item.score,
      completionTime: item.completion_time
    }));
  } catch (error) {
    console.error('Error in getPerformanceHistory:', error);
    return [];
  }
};

// Update user performance after completing a quiz
export const updateUserPerformance = async (
  userId: string, 
  topic: string, 
  score: number,
  completionTime?: number
): Promise<UserPerformance | null> => {
  try {
    console.log(`Updating performance for user ${userId} with score ${score} in ${topic}`);
    
    // Call the Supabase function
    const { data, error } = await supabase
      .rpc('update_user_performance', {
        p_user_id: userId,
        p_topic: topic,
        p_score: score,
        p_completion_time: completionTime
      });

    if (error) {
      console.error('Error updating user performance:', error);
      toast({
        title: "Error updating performance",
        description: "Could not update your performance data.",
        variant: "destructive",
      });
      return null;
    }
    
    console.log('Performance update successful:', data);
    
    // Initialize badges if needed (in case this is the user's first quiz)
    await initializeUserBadges(userId);
    
    // Get the updated quizzes count to pass to badge checking
    const { data: performanceData } = await supabase
      .from('user_performance')
      .select('quizzes_taken')
      .eq('user_id', userId)
      .single();
      
    const quizzesTaken = performanceData?.quizzes_taken || 1;
    
    // Check and award badges based on performance
    await checkAndAwardBadges(userId, topic, score, quizzesTaken);

    toast({
      title: "Performance Updated",
      description: "Your quiz results have been saved.",
      variant: "default",
    });

    // Get fresh performance data
    return getUserPerformance(userId);
  } catch (error) {
    console.error('Error in updateUserPerformance:', error);
    toast({
      title: "Error updating performance",
      description: "An unexpected error occurred.",
      variant: "destructive",
    });
    return null;
  }
};

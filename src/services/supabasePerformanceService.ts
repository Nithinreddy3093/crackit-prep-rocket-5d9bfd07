
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { BadgeType } from '@/components/dashboard/Badges';
import { checkAndAwardBadges, initializeUserBadges } from '@/services/badgeService';

// Types
export interface UserPerformance {
  userId: string;
  overallScore: number;
  topicScores: Record<string, number>;
  quizzesTaken: number;
  lastQuizDate: string;
  strongTopics: string[];
  weakTopics: string[];
}

export interface PerformanceHistory {
  date: string;
  topic: string;
  score: number;
  completionTime?: number;
}

export interface LearningResource {
  id: string;
  topic: string;
  title: string;
  description: string;
  type: string;
  url: string;
  difficulty: string;
  tags: string[];
}

export interface QuizResult {
  id: string;
  user_id: string;
  topic: string;
  score: number;
  completion_time?: number;
  date: string;
  question_details: {
    questionId: string;
    question: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
  }[];
}

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

    // Create topic scores map
    const topicScores: Record<string, number> = {};
    topicScoresData.forEach(item => {
      topicScores[item.topic] = item.score;
    });

    // Sort topics by score to determine strong and weak topics
    const sortedTopics = [...topicScoresData].sort((a, b) => b.score - a.score);
    const strongTopics = sortedTopics.slice(0, 2).map(item => item.topic);
    const weakTopics = [...sortedTopics].reverse().slice(0, 2).map(item => item.topic);

    return {
      userId,
      overallScore: performanceData?.overall_score || 0,
      topicScores,
      quizzesTaken: performanceData?.quizzes_taken || 0,
      lastQuizDate: performanceData?.last_quiz_date || new Date().toISOString(),
      strongTopics,
      weakTopics
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

// Get recent quiz details
export const getRecentQuizDetails = async (userId: string): Promise<QuizResult[]> => {
  try {
    const { data, error } = await supabase
      .from('quiz_results')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .limit(5);

    if (error) {
      console.error('Error fetching quiz results:', error);
      return [];
    }

    return data;
  } catch (error) {
    console.error('Error in getRecentQuizDetails:', error);
    return [];
  }
};

// Get user badges
export const getUserBadges = async (userId: string): Promise<BadgeType[]> => {
  try {
    const { data, error } = await supabase
      .from('user_badges')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching user badges:', error);
      return [];
    }

    return data.map(item => ({
      id: item.badge_id,
      name: item.badge_name,
      icon: item.icon,
      description: item.badge_description,
      earned: true,
      earnedDate: item.earned_date
    }));
  } catch (error) {
    console.error('Error in getUserBadges:', error);
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

// Get AI recommendations based on performance and quiz details
export const getAIRecommendations = async (userId: string): Promise<string> => {
  try {
    const performance = await getUserPerformance(userId);
    
    if (!performance) {
      return "Complete more quizzes to get personalized AI recommendations.";
    }
    
    // Get recent quiz details to provide more accurate recommendations
    const recentQuizzes = await getRecentQuizDetails(userId);
    
    // Calculate topic-specific accuracies
    const topicPerformance: Record<string, { correct: number; total: number }> = {};
    
    recentQuizzes.forEach(quiz => {
      if (!quiz.question_details) return;
      
      quiz.question_details.forEach(detail => {
        const topic = detail.questionId.split('-')[0]; // e.g., "dsa-1" -> "dsa"
        
        if (!topicPerformance[topic]) {
          topicPerformance[topic] = { correct: 0, total: 0 };
        }
        
        topicPerformance[topic].total += 1;
        if (detail.isCorrect) {
          topicPerformance[topic].correct += 1;
        }
      });
    });
    
    // Identify specific strengths and weaknesses by topic
    const topicAnalysis = Object.entries(topicPerformance).map(([topic, stats]) => {
      const accuracy = stats.total > 0 ? (stats.correct / stats.total) * 100 : 0;
      return { 
        topic, 
        accuracy,
        strength: accuracy >= 70,
        weakness: accuracy < 50
      };
    });
    
    // Build AI recommendation
    let recommendation = "Based on your recent quiz performance: ";
    
    const strengths = topicAnalysis.filter(t => t.strength);
    const weaknesses = topicAnalysis.filter(t => t.weakness);
    
    if (strengths.length > 0) {
      recommendation += `You're showing strong understanding in ${strengths.map(s => s.topic.toUpperCase()).join(', ')}. `;
    }
    
    if (weaknesses.length > 0) {
      recommendation += `Focus on improving your knowledge in ${weaknesses.map(w => w.topic.toUpperCase()).join(', ')}. `;
      
      // Add specific advice based on weak areas
      weaknesses.forEach(weak => {
        if (weak.topic === 'dsa') {
          recommendation += "Try practicing more algorithm problems and data structure implementations. ";
        } else if (weak.topic === 'dbms') {
          recommendation += "Review database normalization concepts and practice more SQL queries. ";
        } else if (weak.topic === 'os') {
          recommendation += "Study process scheduling and memory management concepts more thoroughly. ";
        }
      });
    }
    
    if (performance.quizzesTaken < 5) {
      recommendation += "Take more quizzes for more comprehensive recommendations.";
    } else if (performance.overallScore >= 80) {
      recommendation += "You're showing excellent progress! Consider exploring advanced topics.";
    } else if (performance.overallScore >= 60) {
      recommendation += "You're doing well, but could benefit from more consistent practice.";
    } else {
      recommendation += "Focus on understanding fundamental concepts before advancing to more complex topics.";
    }
    
    return recommendation;
  } catch (error) {
    console.error('Error in getAIRecommendations:', error);
    return "Unable to generate recommendations at this time. Please try again later.";
  }
};

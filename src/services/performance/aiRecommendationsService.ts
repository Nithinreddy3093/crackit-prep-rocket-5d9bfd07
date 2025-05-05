
import { getUserPerformance } from "./userPerformanceService";
import { getRecentQuizDetails } from "./quizResultsService";

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
      
      (quiz.question_details as any[]).forEach(detail => {
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

// Badge Computation Engine - Core Logic
import { supabase } from "@/integrations/supabase/client";
import { 
  BadgeDefinition, 
  UserBadgeWithDefinition, 
  UserBadgeStats,
  TopicStrength,
  UserStrengthsData,
  UserStreak,
  TopicImprovement,
  BadgeTier,
  BadgeCategory
} from './types';
import { BADGE_DEFINITIONS, getNormalizedTopic, TOPIC_MAPPINGS } from './badgeDefinitions';
import { toast } from "@/components/ui/use-toast";

// ===== CORE DATA FETCHING =====

interface TopicScore {
  topic: string;
  score: number;
  quizzes_taken: number;
  updated_at: string;
}

interface QuizResult {
  id: string;
  topic: string;
  score: number;
  date: string;
  completion_time: number | null;
  question_details: any[] | null;
}

interface PerformanceHistory {
  topic: string;
  score: number;
  date: string;
}

// Fetch user's topic scores
export const fetchTopicScores = async (userId: string): Promise<TopicScore[]> => {
  const { data, error } = await supabase
    .from('topic_scores')
    .select('*')
    .eq('user_id', userId);
  
  if (error) {
    console.error('Error fetching topic scores:', error);
    return [];
  }
  return data || [];
};

// Fetch user's quiz results
export const fetchQuizResults = async (userId: string): Promise<QuizResult[]> => {
  const { data, error } = await supabase
    .from('quiz_results')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });
  
  if (error) {
    console.error('Error fetching quiz results:', error);
    return [];
  }
  
  return (data || []).map(item => ({
    id: item.id,
    topic: item.topic,
    score: item.score,
    date: item.date,
    completion_time: item.completion_time,
    question_details: Array.isArray(item.question_details) ? item.question_details : []
  }));
};

// Fetch performance history
export const fetchPerformanceHistory = async (userId: string): Promise<PerformanceHistory[]> => {
  const { data, error } = await supabase
    .from('performance_history')
    .select('topic, score, date')
    .eq('user_id', userId)
    .order('date', { ascending: true });
  
  if (error) {
    console.error('Error fetching performance history:', error);
    return [];
  }
  return data || [];
};

// ===== STREAK CALCULATION =====

export const calculateStreak = async (userId: string): Promise<UserStreak> => {
  const quizResults = await fetchQuizResults(userId);
  
  if (quizResults.length === 0) {
    return {
      userId,
      currentStreak: 0,
      longestStreak: 0,
      lastActivityDate: '',
      streakStartDate: ''
    };
  }

  // Get unique activity dates
  const activityDates = [...new Set(
    quizResults.map(q => new Date(q.date).toISOString().split('T')[0])
  )].sort().reverse();

  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  let streakStartDate = '';
  
  // Check if streak is still active (activity today or yesterday)
  const isActive = activityDates[0] === today || activityDates[0] === yesterday;
  
  if (isActive) {
    let prevDate = new Date(activityDates[0]);
    currentStreak = 1;
    streakStartDate = activityDates[0];
    
    for (let i = 1; i < activityDates.length; i++) {
      const currentDate = new Date(activityDates[i]);
      const dayDiff = Math.floor((prevDate.getTime() - currentDate.getTime()) / 86400000);
      
      if (dayDiff === 1) {
        currentStreak++;
        streakStartDate = activityDates[i];
      } else {
        break;
      }
      prevDate = currentDate;
    }
  }

  // Calculate longest streak
  for (let i = 0; i < activityDates.length; i++) {
    if (i === 0) {
      tempStreak = 1;
    } else {
      const prevDate = new Date(activityDates[i - 1]);
      const currentDate = new Date(activityDates[i]);
      const dayDiff = Math.floor((prevDate.getTime() - currentDate.getTime()) / 86400000);
      
      if (dayDiff === 1) {
        tempStreak++;
      } else {
        tempStreak = 1;
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);
  }

  return {
    userId,
    currentStreak,
    longestStreak,
    lastActivityDate: activityDates[0] || '',
    streakStartDate
  };
};

// ===== IMPROVEMENT CALCULATION =====

export const calculateTopicImprovements = async (userId: string): Promise<TopicImprovement[]> => {
  const history = await fetchPerformanceHistory(userId);
  const improvements: TopicImprovement[] = [];
  
  // Group by topic
  const topicHistory: Record<string, PerformanceHistory[]> = {};
  history.forEach(h => {
    const normalizedTopic = getNormalizedTopic(h.topic);
    if (!topicHistory[normalizedTopic]) {
      topicHistory[normalizedTopic] = [];
    }
    topicHistory[normalizedTopic].push(h);
  });

  // Calculate improvement for each topic
  for (const [topic, scores] of Object.entries(topicHistory)) {
    if (scores.length < 2) continue;
    
    // Get first and last 3 scores
    const firstScores = scores.slice(0, Math.min(3, scores.length));
    const lastScores = scores.slice(-Math.min(3, scores.length));
    
    const previousAvg = firstScores.reduce((s, h) => s + h.score, 0) / firstScores.length;
    const currentAvg = lastScores.reduce((s, h) => s + h.score, 0) / lastScores.length;
    
    const improvementPercent = currentAvg - previousAvg;
    
    if (improvementPercent > 0) {
      const firstDate = new Date(firstScores[0].date);
      const lastDate = new Date(lastScores[lastScores.length - 1].date);
      const periodDays = Math.ceil((lastDate.getTime() - firstDate.getTime()) / 86400000);
      
      improvements.push({
        topic,
        previousScore: Math.round(previousAvg),
        currentScore: Math.round(currentAvg),
        improvementPercent: Math.round(improvementPercent),
        periodDays
      });
    }
  }

  return improvements.sort((a, b) => b.improvementPercent - a.improvementPercent);
};

// ===== BADGE ELIGIBILITY ENGINE =====

interface BadgeEligibilityContext {
  topicScores: TopicScore[];
  quizResults: QuizResult[];
  streak: UserStreak;
  improvements: TopicImprovement[];
  totalQuizzes: number;
  totalQuestions: number;
}

const checkBadgeEligibility = (
  badge: BadgeDefinition, 
  context: BadgeEligibilityContext
): { eligible: boolean; progress: number } => {
  const { criteria } = badge;
  
  switch (criteria.type) {
    case 'topic_mastery': {
      const normalizedTarget = criteria.topic || '';
      const relevantTopics = context.topicScores.filter(ts => {
        const normalizedTopic = getNormalizedTopic(ts.topic);
        // Check if this topic matches or if it's a category (company-prep includes multiple)
        if (normalizedTarget === 'company-prep') {
          return TOPIC_MAPPINGS['company-prep'].some(t => 
            ts.topic.toLowerCase().includes(t.toLowerCase())
          );
        }
        return normalizedTopic === normalizedTarget;
      });
      
      if (relevantTopics.length === 0) {
        return { eligible: false, progress: 0 };
      }
      
      // Aggregate scores across matching topics
      const totalAttempts = relevantTopics.reduce((s, t) => s + t.quizzes_taken, 0);
      const avgScore = relevantTopics.reduce((s, t) => s + t.score * t.quizzes_taken, 0) / totalAttempts;
      
      const attemptProgress = Math.min(100, (totalAttempts / (criteria.minAttempts || 1)) * 100);
      const accuracyProgress = Math.min(100, (avgScore / (criteria.minAccuracy || 1)) * 100);
      const progress = Math.round((attemptProgress + accuracyProgress) / 2);
      
      const eligible = totalAttempts >= (criteria.minAttempts || 0) && 
                       avgScore >= (criteria.minAccuracy || 0);
      
      return { eligible, progress };
    }
    
    case 'streak': {
      const requiredDays = criteria.streakDays || 0;
      const currentStreak = Math.max(context.streak.currentStreak, context.streak.longestStreak);
      const progress = Math.min(100, Math.round((currentStreak / requiredDays) * 100));
      return { eligible: currentStreak >= requiredDays, progress };
    }
    
    case 'accuracy': {
      const minAccuracy = criteria.minAccuracy || 0;
      const minAttempts = criteria.minAttempts || 1;
      
      // Check if user has achieved this accuracy
      const highScoreQuizzes = context.quizResults.filter(q => q.score >= minAccuracy);
      
      if (minAttempts === 1) {
        // Single quiz achievement
        const bestScore = Math.max(...context.quizResults.map(q => q.score), 0);
        const progress = Math.min(100, Math.round((bestScore / minAccuracy) * 100));
        return { eligible: bestScore >= minAccuracy, progress };
      }
      
      // Multiple quizzes average
      const recentQuizzes = context.quizResults.slice(0, minAttempts);
      if (recentQuizzes.length < minAttempts) {
        return { eligible: false, progress: Math.round((recentQuizzes.length / minAttempts) * 50) };
      }
      
      const avgScore = recentQuizzes.reduce((s, q) => s + q.score, 0) / recentQuizzes.length;
      return { eligible: avgScore >= minAccuracy, progress: Math.min(100, Math.round((avgScore / minAccuracy) * 100)) };
    }
    
    case 'speed': {
      const minAccuracy = criteria.minAccuracy || 0;
      const maxTimePerQ = criteria.maxTimePerQuestion || 120;
      
      for (const quiz of context.quizResults) {
        if (quiz.score >= minAccuracy && quiz.completion_time) {
          const questions = quiz.question_details?.length || 10;
          const timePerQuestion = quiz.completion_time / questions;
          if (timePerQuestion <= maxTimePerQ) {
            return { eligible: true, progress: 100 };
          }
        }
      }
      
      // Calculate progress based on best attempt
      let bestProgress = 0;
      for (const quiz of context.quizResults) {
        if (quiz.completion_time) {
          const questions = quiz.question_details?.length || 10;
          const timePerQuestion = quiz.completion_time / questions;
          const speedProgress = Math.min(100, (maxTimePerQ / timePerQuestion) * 50);
          const accuracyProgress = Math.min(100, (quiz.score / minAccuracy) * 50);
          bestProgress = Math.max(bestProgress, speedProgress + accuracyProgress);
        }
      }
      return { eligible: false, progress: Math.round(bestProgress) };
    }
    
    case 'improvement': {
      const requiredImprovement = criteria.improvementPercent || 0;
      const bestImprovement = context.improvements[0]?.improvementPercent || 0;
      const progress = Math.min(100, Math.round((bestImprovement / requiredImprovement) * 100));
      return { eligible: bestImprovement >= requiredImprovement, progress };
    }
    
    case 'milestone': {
      if (criteria.quizCount) {
        const progress = Math.min(100, Math.round((context.totalQuizzes / criteria.quizCount) * 100));
        return { eligible: context.totalQuizzes >= criteria.quizCount, progress };
      }
      if (criteria.questionCount) {
        const progress = Math.min(100, Math.round((context.totalQuestions / criteria.questionCount) * 100));
        return { eligible: context.totalQuestions >= criteria.questionCount, progress };
      }
      return { eligible: false, progress: 0 };
    }
    
    default:
      return { eligible: false, progress: 0 };
  }
};

// ===== MAIN BADGE COMPUTATION =====

export const computeUserBadges = async (userId: string): Promise<UserBadgeWithDefinition[]> => {
  try {
    // Fetch all required data in parallel
    const [topicScores, quizResults, streak, improvements, existingBadges] = await Promise.all([
      fetchTopicScores(userId),
      fetchQuizResults(userId),
      calculateStreak(userId),
      calculateTopicImprovements(userId),
      fetchExistingBadges(userId)
    ]);

    const totalQuizzes = quizResults.length;
    const totalQuestions = quizResults.reduce((sum, q) => {
      return sum + (q.question_details?.length || 10);
    }, 0);

    const context: BadgeEligibilityContext = {
      topicScores,
      quizResults,
      streak,
      improvements,
      totalQuizzes,
      totalQuestions
    };

    const userBadges: UserBadgeWithDefinition[] = [];
    const newlyEarnedBadges: BadgeDefinition[] = [];

    for (const badge of BADGE_DEFINITIONS) {
      const existingBadge = existingBadges.find(b => b.badge_id === badge.id);
      const { eligible, progress } = checkBadgeEligibility(badge, context);

      if (eligible) {
        if (!existingBadge) {
          // Award new badge
          newlyEarnedBadges.push(badge);
          await awardBadge(userId, badge);
        }
        
        userBadges.push({
          ...badge,
          earned: true,
          earnedDate: existingBadge?.earned_date || new Date().toISOString(),
          status: 'earned',
          progress: 100
        });
      } else {
        userBadges.push({
          ...badge,
          earned: false,
          status: 'locked',
          progress
        });
      }
    }

    // Show toast for newly earned badges
    if (newlyEarnedBadges.length > 0) {
      const names = newlyEarnedBadges.map(b => b.name).join(', ');
      toast({
        title: `🎉 New Badge${newlyEarnedBadges.length > 1 ? 's' : ''} Earned!`,
        description: names,
        variant: "default"
      });
    }

    return userBadges;
  } catch (error) {
    console.error('Error computing user badges:', error);
    return [];
  }
};

// Fetch existing badges from database
const fetchExistingBadges = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_badges')
    .select('*')
    .eq('user_id', userId);
  
  if (error) {
    console.error('Error fetching existing badges:', error);
    return [];
  }
  return data || [];
};

// Award a new badge
const awardBadge = async (userId: string, badge: BadgeDefinition): Promise<void> => {
  const { error } = await supabase
    .from('user_badges')
    .insert({
      user_id: userId,
      badge_id: badge.id,
      badge_name: badge.name,
      badge_description: badge.description,
      icon: badge.icon,
      earned_date: new Date().toISOString()
    });

  if (error) {
    console.error('Error awarding badge:', error);
  }
};

// ===== STRENGTH COMPUTATION =====

const getDisplayTopicName = (topic: string): string => {
  const displayNames: Record<string, string> = {
    'dsa': 'Data Structures & Algorithms',
    'dbms': 'Database Management',
    'oops': 'Object-Oriented Programming',
    'os': 'Operating Systems',
    'ai-ml': 'AI & Machine Learning',
    'web': 'Web Development',
    'networking': 'Computer Networks',
    'polity': 'Indian Polity',
    'history': 'History',
    'geography': 'Geography'
  };
  
  const normalized = getNormalizedTopic(topic);
  return displayNames[normalized] || topic.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

const getTierFromScore = (accuracy: number, attempts: number): BadgeTier => {
  if (accuracy >= 85 && attempts >= 10) return 'gold';
  if (accuracy >= 70 && attempts >= 5) return 'silver';
  return 'bronze';
};

export const computeUserStrengths = async (userId: string): Promise<UserStrengthsData> => {
  try {
    const topicScores = await fetchTopicScores(userId);
    
    // Threshold: A topic is a strength if accuracy >= 75% and attempts >= 3
    const STRENGTH_ACCURACY_THRESHOLD = 75;
    const STRENGTH_ATTEMPTS_THRESHOLD = 3;
    const WEAKNESS_ACCURACY_THRESHOLD = 50;

    const strengths: TopicStrength[] = [];
    const weaknesses: TopicStrength[] = [];

    for (const ts of topicScores) {
      const topicData: TopicStrength = {
        topic: ts.topic,
        displayName: getDisplayTopicName(ts.topic),
        accuracy: ts.score,
        attempts: ts.quizzes_taken,
        lastActivity: ts.updated_at,
        tier: getTierFromScore(ts.score, ts.quizzes_taken)
      };

      if (ts.score >= STRENGTH_ACCURACY_THRESHOLD && ts.quizzes_taken >= STRENGTH_ATTEMPTS_THRESHOLD) {
        strengths.push(topicData);
      } else if (ts.score < WEAKNESS_ACCURACY_THRESHOLD && ts.quizzes_taken >= 2) {
        weaknesses.push(topicData);
      }
    }

    // Sort by accuracy descending
    strengths.sort((a, b) => b.accuracy - a.accuracy);
    weaknesses.sort((a, b) => a.accuracy - b.accuracy);

    // Generate recommendations
    const recommendations: string[] = [];
    if (strengths.length === 0) {
      recommendations.push('Complete 3 quizzes in any topic with 75%+ accuracy to unlock your first strength!');
    }
    if (weaknesses.length > 0) {
      recommendations.push(`Focus on improving ${weaknesses[0].displayName} - currently at ${weaknesses[0].accuracy}%`);
    }
    if (topicScores.length < 3) {
      recommendations.push('Explore more topics to discover your full potential');
    }

    return {
      strengths: strengths.slice(0, 5), // Top 5 strengths
      weaknesses: weaknesses.slice(0, 3), // Top 3 weaknesses
      recommendations
    };
  } catch (error) {
    console.error('Error computing user strengths:', error);
    return { strengths: [], weaknesses: [], recommendations: [] };
  }
};

// ===== BADGE STATS =====

export const computeBadgeStats = async (userId: string): Promise<UserBadgeStats> => {
  const badges = await computeUserBadges(userId);
  
  const earned = badges.filter(b => b.earned);
  const locked = badges.filter(b => !b.earned);
  
  const byCategory: Record<BadgeCategory, number> = {
    skill: 0,
    consistency: 0,
    accuracy: 0,
    improvement: 0,
    milestone: 0
  };
  
  const byTier: Record<BadgeTier, number> = {
    bronze: 0,
    silver: 0,
    gold: 0,
    platinum: 0
  };
  
  earned.forEach(b => {
    byCategory[b.category]++;
    byTier[b.tier]++;
  });

  // Sort earned by date (most recent first)
  const recentlyEarned = [...earned]
    .sort((a, b) => new Date(b.earnedDate || 0).getTime() - new Date(a.earnedDate || 0).getTime())
    .slice(0, 5);

  // Get locked badges with highest progress
  const lockedWithProgress = [...locked]
    .filter(b => (b.progress || 0) > 0)
    .sort((a, b) => (b.progress || 0) - (a.progress || 0))
    .slice(0, 5);

  return {
    totalEarned: earned.length,
    byCategory,
    byTier,
    recentlyEarned,
    lockedWithProgress
  };
};

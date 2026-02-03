// Badge System Types - Professional Badge & Strength System

export type BadgeTier = 'bronze' | 'silver' | 'gold' | 'platinum';
export type BadgeCategory = 'skill' | 'consistency' | 'accuracy' | 'improvement' | 'milestone';
export type BadgeStatus = 'locked' | 'earned' | 'inactive';

export interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  category: BadgeCategory;
  tier: BadgeTier;
  icon: string;
  requirement: string; // Human-readable requirement
  criteria: BadgeCriteria;
}

export interface BadgeCriteria {
  type: 'topic_mastery' | 'streak' | 'accuracy' | 'improvement' | 'milestone' | 'speed';
  // For topic mastery
  topic?: string;
  minAccuracy?: number;
  minAttempts?: number;
  // For streaks
  streakDays?: number;
  // For milestones
  quizCount?: number;
  questionCount?: number;
  // For improvement
  improvementPercent?: number;
  // For speed
  maxTimePerQuestion?: number; // seconds
}

export interface EarnedBadge {
  id: string;
  badgeId: string;
  userId: string;
  earnedDate: string;
  status: BadgeStatus;
  metadata?: Record<string, any>;
}

export interface UserBadgeWithDefinition extends BadgeDefinition {
  earned: boolean;
  earnedDate?: string;
  status: BadgeStatus;
  progress?: number; // 0-100 for locked badges showing progress
}

export interface TopicStrength {
  topic: string;
  displayName: string;
  accuracy: number;
  attempts: number;
  lastActivity: string;
  badge?: UserBadgeWithDefinition;
  tier: BadgeTier;
}

export interface UserStrengthsData {
  strengths: TopicStrength[];
  weaknesses: TopicStrength[];
  recommendations: string[];
}

export interface UserBadgeStats {
  totalEarned: number;
  byCategory: Record<BadgeCategory, number>;
  byTier: Record<BadgeTier, number>;
  recentlyEarned: UserBadgeWithDefinition[];
  lockedWithProgress: UserBadgeWithDefinition[];
}

// Streak tracking
export interface UserStreak {
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string;
  streakStartDate: string;
}

// Improvement tracking
export interface TopicImprovement {
  topic: string;
  previousScore: number;
  currentScore: number;
  improvementPercent: number;
  periodDays: number;
}

// Badge tier colors for styling
export const BADGE_TIER_COLORS: Record<BadgeTier, { bg: string; border: string; text: string; glow: string }> = {
  bronze: {
    bg: 'from-amber-700 to-amber-900',
    border: 'border-amber-600',
    text: 'text-amber-400',
    glow: 'shadow-amber-500/30'
  },
  silver: {
    bg: 'from-gray-300 to-gray-500',
    border: 'border-gray-400',
    text: 'text-gray-300',
    glow: 'shadow-gray-400/30'
  },
  gold: {
    bg: 'from-yellow-400 to-amber-500',
    border: 'border-yellow-400',
    text: 'text-yellow-400',
    glow: 'shadow-yellow-400/40'
  },
  platinum: {
    bg: 'from-purple-400 via-pink-400 to-blue-400',
    border: 'border-purple-400',
    text: 'text-purple-300',
    glow: 'shadow-purple-400/50'
  }
};

export const BADGE_CATEGORY_LABELS: Record<BadgeCategory, string> = {
  skill: 'Skill Badges',
  consistency: 'Consistency Badges',
  accuracy: 'Performance Badges',
  improvement: 'Improvement Badges',
  milestone: 'Milestone Badges'
};

// Complete Badge Definitions - All 5 Categories
import { BadgeDefinition } from './types';

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  // ===== A. SKILL BADGES (Topic-based) =====
  // DSA Badges
  {
    id: 'dsa-beginner',
    name: 'DSA Beginner',
    description: 'Started your journey in Data Structures & Algorithms',
    category: 'skill',
    tier: 'bronze',
    icon: 'Code',
    requirement: 'Complete 3 DSA quizzes with 50%+ accuracy',
    criteria: { type: 'topic_mastery', topic: 'dsa', minAccuracy: 50, minAttempts: 3 }
  },
  {
    id: 'dsa-intermediate',
    name: 'DSA Intermediate',
    description: 'Solid understanding of Data Structures & Algorithms',
    category: 'skill',
    tier: 'silver',
    icon: 'Code',
    requirement: 'Complete 7 DSA quizzes with 70%+ accuracy',
    criteria: { type: 'topic_mastery', topic: 'dsa', minAccuracy: 70, minAttempts: 7 }
  },
  {
    id: 'dsa-advanced',
    name: 'DSA Master',
    description: 'Expert-level mastery in Data Structures & Algorithms',
    category: 'skill',
    tier: 'gold',
    icon: 'Code',
    requirement: 'Complete 15 DSA quizzes with 85%+ accuracy',
    criteria: { type: 'topic_mastery', topic: 'dsa', minAccuracy: 85, minAttempts: 15 }
  },
  
  // DBMS Badges
  {
    id: 'dbms-fundamentals',
    name: 'DBMS Fundamentals',
    description: 'Solid foundation in Database Management',
    category: 'skill',
    tier: 'bronze',
    icon: 'Database',
    requirement: 'Complete 3 DBMS quizzes with 50%+ accuracy',
    criteria: { type: 'topic_mastery', topic: 'dbms', minAccuracy: 50, minAttempts: 3 }
  },
  {
    id: 'sql-expert',
    name: 'SQL Expert',
    description: 'Advanced proficiency in databases and SQL',
    category: 'skill',
    tier: 'gold',
    icon: 'Database',
    requirement: 'Complete 10 DBMS quizzes with 80%+ accuracy',
    criteria: { type: 'topic_mastery', topic: 'dbms', minAccuracy: 80, minAttempts: 10 }
  },
  
  // OOPs Badges
  {
    id: 'oops-learner',
    name: 'OOP Learner',
    description: 'Learning Object-Oriented Programming concepts',
    category: 'skill',
    tier: 'bronze',
    icon: 'Box',
    requirement: 'Complete 3 OOPs quizzes with 50%+ accuracy',
    criteria: { type: 'topic_mastery', topic: 'oops', minAccuracy: 50, minAttempts: 3 }
  },
  {
    id: 'oops-master',
    name: 'OOP Master',
    description: 'Expert in Object-Oriented Programming',
    category: 'skill',
    tier: 'gold',
    icon: 'Box',
    requirement: 'Complete 10 OOPs quizzes with 80%+ accuracy',
    criteria: { type: 'topic_mastery', topic: 'oops', minAccuracy: 80, minAttempts: 10 }
  },
  
  // OS Badges
  {
    id: 'os-basics',
    name: 'OS Fundamentals',
    description: 'Understanding Operating Systems basics',
    category: 'skill',
    tier: 'bronze',
    icon: 'Cpu',
    requirement: 'Complete 3 OS quizzes with 50%+ accuracy',
    criteria: { type: 'topic_mastery', topic: 'os', minAccuracy: 50, minAttempts: 3 }
  },
  {
    id: 'os-specialist',
    name: 'OS Specialist',
    description: 'Expert-level knowledge of Operating Systems',
    category: 'skill',
    tier: 'gold',
    icon: 'Cpu',
    requirement: 'Complete 10 OS quizzes with 80%+ accuracy',
    criteria: { type: 'topic_mastery', topic: 'os', minAccuracy: 80, minAttempts: 10 }
  },
  
  // AI/ML Badges
  {
    id: 'ai-apprentice',
    name: 'AI Apprentice',
    description: 'Beginning your AI/ML journey',
    category: 'skill',
    tier: 'bronze',
    icon: 'Brain',
    requirement: 'Complete 3 AI/ML quizzes with 50%+ accuracy',
    criteria: { type: 'topic_mastery', topic: 'ai-ml', minAccuracy: 50, minAttempts: 3 }
  },
  {
    id: 'ml-expert',
    name: 'ML Expert',
    description: 'Advanced understanding of Machine Learning',
    category: 'skill',
    tier: 'gold',
    icon: 'Brain',
    requirement: 'Complete 10 AI/ML quizzes with 80%+ accuracy',
    criteria: { type: 'topic_mastery', topic: 'ai-ml', minAccuracy: 80, minAttempts: 10 }
  },

  // Company Prep Badges
  {
    id: 'placement-ready',
    name: 'Placement Ready',
    description: 'Prepared for company placements',
    category: 'skill',
    tier: 'silver',
    icon: 'Building',
    requirement: 'Complete 5 company prep quizzes with 70%+ accuracy',
    criteria: { type: 'topic_mastery', topic: 'company-prep', minAccuracy: 70, minAttempts: 5 }
  },
  
  // UPSC Badges
  {
    id: 'upsc-aspirant',
    name: 'UPSC Aspirant',
    description: 'Started UPSC preparation',
    category: 'skill',
    tier: 'bronze',
    icon: 'Landmark',
    requirement: 'Complete 5 UPSC quizzes',
    criteria: { type: 'topic_mastery', topic: 'upsc', minAccuracy: 40, minAttempts: 5 }
  },
  {
    id: 'polity-stronghold',
    name: 'Polity Stronghold',
    description: 'Strong command over Indian Polity',
    category: 'skill',
    tier: 'gold',
    icon: 'Scale',
    requirement: 'Complete 10 Polity quizzes with 75%+ accuracy',
    criteria: { type: 'topic_mastery', topic: 'polity', minAccuracy: 75, minAttempts: 10 }
  },

  // ===== B. CONSISTENCY BADGES (Streaks) =====
  {
    id: 'daily-learner',
    name: 'Daily Learner',
    description: 'Consistent learning habits forming',
    category: 'consistency',
    tier: 'bronze',
    icon: 'Flame',
    requirement: 'Maintain a 3-day streak',
    criteria: { type: 'streak', streakDays: 3 }
  },
  {
    id: 'week-warrior',
    name: 'Week Warrior',
    description: 'A full week of dedication',
    category: 'consistency',
    tier: 'silver',
    icon: 'Flame',
    requirement: 'Maintain a 7-day streak',
    criteria: { type: 'streak', streakDays: 7 }
  },
  {
    id: 'consistency-champ',
    name: 'Consistency Champ',
    description: 'Two weeks of unbroken learning',
    category: 'consistency',
    tier: 'gold',
    icon: 'Flame',
    requirement: 'Maintain a 14-day streak',
    criteria: { type: 'streak', streakDays: 14 }
  },
  {
    id: 'iron-discipline',
    name: 'Iron Discipline',
    description: 'A month of relentless dedication',
    category: 'consistency',
    tier: 'platinum',
    icon: 'Flame',
    requirement: 'Maintain a 30-day streak',
    criteria: { type: 'streak', streakDays: 30 }
  },

  // ===== C. ACCURACY & PERFORMANCE BADGES =====
  {
    id: 'sharp-shooter',
    name: 'Sharp Shooter',
    description: 'Exceptional accuracy in quizzes',
    category: 'accuracy',
    tier: 'gold',
    icon: 'Target',
    requirement: 'Achieve 90%+ accuracy in any quiz',
    criteria: { type: 'accuracy', minAccuracy: 90, minAttempts: 1 }
  },
  {
    id: 'perfectionist',
    name: 'Perfectionist',
    description: 'Flawless performance - 100% accuracy',
    category: 'accuracy',
    tier: 'platinum',
    icon: 'Star',
    requirement: 'Score 100% in any quiz',
    criteria: { type: 'accuracy', minAccuracy: 100, minAttempts: 1 }
  },
  {
    id: 'speed-solver',
    name: 'Speed Solver',
    description: 'Quick thinking under pressure',
    category: 'accuracy',
    tier: 'silver',
    icon: 'Zap',
    requirement: 'Complete a quiz with 70%+ accuracy in under 2 min/question',
    criteria: { type: 'speed', minAccuracy: 70, maxTimePerQuestion: 120 }
  },
  {
    id: 'lightning-fast',
    name: 'Lightning Fast',
    description: 'Blazing speed with high accuracy',
    category: 'accuracy',
    tier: 'gold',
    icon: 'Zap',
    requirement: 'Complete a quiz with 80%+ accuracy in under 1 min/question',
    criteria: { type: 'speed', minAccuracy: 80, maxTimePerQuestion: 60 }
  },
  {
    id: 'no-guesswork',
    name: 'No Guesswork',
    description: 'Thoughtful answers, minimal mistakes',
    category: 'accuracy',
    tier: 'silver',
    icon: 'CheckCircle',
    requirement: 'Complete 5 quizzes with 80%+ average accuracy',
    criteria: { type: 'accuracy', minAccuracy: 80, minAttempts: 5 }
  },

  // ===== D. IMPROVEMENT BADGES =====
  {
    id: 'comeback-kid',
    name: 'Comeback Kid',
    description: 'Significant improvement in performance',
    category: 'improvement',
    tier: 'gold',
    icon: 'TrendingUp',
    requirement: 'Improve accuracy by 20%+ in any topic',
    criteria: { type: 'improvement', improvementPercent: 20 }
  },
  {
    id: 'weakness-crusher',
    name: 'Weakness Crusher',
    description: 'Turned a weakness into a strength',
    category: 'improvement',
    tier: 'platinum',
    icon: 'Sword',
    requirement: 'Improve a topic from <50% to >75% accuracy',
    criteria: { type: 'improvement', improvementPercent: 25 }
  },
  {
    id: 'steady-climber',
    name: 'Steady Climber',
    description: 'Consistent improvement over time',
    category: 'improvement',
    tier: 'silver',
    icon: 'TrendingUp',
    requirement: 'Improve overall score for 3 consecutive quizzes',
    criteria: { type: 'improvement', improvementPercent: 10 }
  },
  {
    id: 'rank-climber',
    name: 'Rank Climber',
    description: 'Moving up the leaderboard',
    category: 'improvement',
    tier: 'gold',
    icon: 'ArrowUp',
    requirement: 'Improve leaderboard rank by 10+ positions',
    criteria: { type: 'improvement', improvementPercent: 10 }
  },

  // ===== E. MILESTONE BADGES =====
  {
    id: 'first-step',
    name: 'First Step',
    description: 'Every journey begins with a single step',
    category: 'milestone',
    tier: 'bronze',
    icon: 'Play',
    requirement: 'Complete your first quiz',
    criteria: { type: 'milestone', quizCount: 1 }
  },
  {
    id: 'getting-started',
    name: 'Getting Started',
    description: 'Building momentum',
    category: 'milestone',
    tier: 'bronze',
    icon: 'Star',
    requirement: 'Complete 5 quizzes',
    criteria: { type: 'milestone', quizCount: 5 }
  },
  {
    id: 'dedicated-learner',
    name: 'Dedicated Learner',
    description: 'Serious about learning',
    category: 'milestone',
    tier: 'silver',
    icon: 'Award',
    requirement: 'Complete 25 quizzes',
    criteria: { type: 'milestone', quizCount: 25 }
  },
  {
    id: 'quiz-veteran',
    name: 'Quiz Veteran',
    description: 'Experienced quiz taker',
    category: 'milestone',
    tier: 'gold',
    icon: 'Trophy',
    requirement: 'Complete 50 quizzes',
    criteria: { type: 'milestone', quizCount: 50 }
  },
  {
    id: 'centurion',
    name: 'Centurion',
    description: 'The 100 quiz milestone',
    category: 'milestone',
    tier: 'platinum',
    icon: 'Crown',
    requirement: 'Complete 100 quizzes',
    criteria: { type: 'milestone', quizCount: 100 }
  },
  {
    id: 'question-hunter',
    name: 'Question Hunter',
    description: 'Answered many questions',
    category: 'milestone',
    tier: 'silver',
    icon: 'HelpCircle',
    requirement: 'Answer 500 questions',
    criteria: { type: 'milestone', questionCount: 500 }
  },
  {
    id: 'knowledge-seeker',
    name: 'Knowledge Seeker',
    description: 'Thousands of questions conquered',
    category: 'milestone',
    tier: 'gold',
    icon: 'BookOpen',
    requirement: 'Answer 1000 questions',
    criteria: { type: 'milestone', questionCount: 1000 }
  }
];

// Topic name mappings for badge computation
export const TOPIC_MAPPINGS: Record<string, string[]> = {
  'dsa': ['dsa', 'data structures', 'algorithms', 'Data Structures & Algorithms', 'data-structures'],
  'dbms': ['dbms', 'database', 'sql', 'Database Management', 'database-management'],
  'oops': ['oops', 'oop', 'object-oriented', 'Object-Oriented Programming', 'object-oriented-programming'],
  'os': ['os', 'operating-systems', 'Operating Systems', 'operating systems'],
  'ai-ml': ['ai', 'ml', 'ai-ml', 'machine learning', 'AI & Machine Learning', 'artificial-intelligence'],
  'company-prep': ['tcs', 'infosys', 'wipro', 'cognizant', 'ibm', 'amazon', 'microsoft', 'google', 'capgemini', 'deloitte', 'hcl', 'tech-mahindra'],
  'upsc': ['upsc', 'civil-services', 'ias'],
  'polity': ['polity', 'indian-polity', 'constitution']
};

// Get normalized topic for badge computation
export const getNormalizedTopic = (topic: string): string => {
  const lowerTopic = topic.toLowerCase();
  for (const [normalized, variations] of Object.entries(TOPIC_MAPPINGS)) {
    if (variations.some(v => lowerTopic.includes(v.toLowerCase()))) {
      return normalized;
    }
  }
  return lowerTopic;
};

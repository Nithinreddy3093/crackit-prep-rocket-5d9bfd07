
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { BadgeType } from '@/components/dashboard/Badges';

// Define badge criteria and helper functions
const BADGE_CRITERIA = {
  // Topic mastery badges
  "algorithm-master": {
    check: (topic: string, score: number) => topic === 'Data Structures and Algorithms' && score >= 75,
    name: "Algorithm Master",
    icon: "Code",
    description: "Scored above 75% in Data Structures and Algorithms quiz"
  },
  "sql-expert": {
    check: (topic: string, score: number) => topic === 'Database Management' && score >= 80,
    name: "SQL Expert",
    icon: "Database",
    description: "Scored above 80% in SQL and Database Management quiz"
  },
  "os-specialist": {
    check: (topic: string, score: number) => topic === 'Operating Systems' && score >= 80,
    name: "OS Specialist", 
    icon: "Cpu",
    description: "Scored above 80% in Operating Systems quiz"
  },
  // Completion badges
  "quiz-starter": {
    check: (_: string, __: number, quizCount: number) => quizCount >= 1,
    name: "Quiz Starter",
    icon: "Play",
    description: "Completed your first quiz"
  },
  "quiz-enthusiast": {
    check: (_: string, __: number, quizCount: number) => quizCount >= 5,
    name: "Quiz Enthusiast",
    icon: "Star",
    description: "Completed 5 quizzes"
  },
  "quiz-master": {
    check: (_: string, __: number, quizCount: number) => quizCount >= 10,
    name: "Quiz Master",
    icon: "Award",
    description: "Completed 10 quizzes"
  }
};

// Check and award badges based on quiz performance
export const checkAndAwardBadges = async (
  userId: string,
  topic: string,
  score: number,
  quizzesTaken: number
): Promise<BadgeType[]> => {
  try {
    const awardedBadges: BadgeType[] = [];
    
    // Check each badge criteria
    for (const [badgeId, criteria] of Object.entries(BADGE_CRITERIA)) {
      if (criteria.check(topic, score, quizzesTaken)) {
        // Check if user already has this badge
        const { data, error } = await supabase
          .from('user_badges')
          .select('*')
          .eq('user_id', userId)
          .eq('badge_id', badgeId)
          .single();
          
        if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
          console.error(`Error checking badge ${badgeId}:`, error);
          continue;
        }
        
        // If badge doesn't exist, award it
        if (!data) {
          const newBadge = {
            badge_id: badgeId,
            user_id: userId,
            badge_name: criteria.name,
            badge_description: criteria.description,
            icon: criteria.icon,
            earned_date: new Date().toISOString()
          };
          
          const { data: badgeData, error: insertError } = await supabase
            .from('user_badges')
            .insert(newBadge)
            .select()
            .single();
            
          if (insertError) {
            console.error(`Error awarding badge ${badgeId}:`, insertError);
          } else {
            // Convert to BadgeType format
            const awardedBadge: BadgeType = {
              id: badgeData.badge_id,
              name: badgeData.badge_name,
              description: badgeData.badge_description,
              icon: badgeData.icon,
              earned: true,
              earnedDate: badgeData.earned_date
            };
            
            awardedBadges.push(awardedBadge);
            
            // Show toast notification for newly earned badge
            toast({
              title: "New Badge Earned!",
              description: `Congratulations! You've earned the "${criteria.name}" badge!`,
              variant: "default",
            });
          }
        }
      }
    }
    
    return awardedBadges;
  } catch (error) {
    console.error('Error in checkAndAwardBadges:', error);
    return [];
  }
};

// Initialize default badges for new users
export const initializeUserBadges = async (userId: string): Promise<void> => {
  try {
    // Check if user already has badges
    const { data, error } = await supabase
      .from('user_badges')
      .select('*')
      .eq('user_id', userId);
      
    if (error) {
      console.error('Error checking user badges:', error);
      return;
    }
    
    // If user has no badges, insert default ones (all unearned)
    if (data.length === 0) {
      const defaultBadges = Object.entries(BADGE_CRITERIA).map(([badgeId, criteria]) => ({
        badge_id: badgeId,
        user_id: userId,
        badge_name: criteria.name,
        badge_description: criteria.description,
        icon: criteria.icon,
        earned: false
      }));
      
      const { error: insertError } = await supabase
        .from('user_badges')
        .insert(defaultBadges);
        
      if (insertError) {
        console.error('Error initializing default badges:', insertError);
      }
    }
  } catch (error) {
    console.error('Error in initializeUserBadges:', error);
  }
};


import { toast } from "@/components/ui/use-toast";

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
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  earned: boolean;
  earnedDate?: string;
}

// Mock data for now - this would be replaced with actual database calls
let mockUserPerformance: UserPerformance = {
  userId: "user-123",
  overallScore: 72,
  topicScores: {
    "Data Structures and Algorithms": 75,
    "Operating Systems": 65,
    "Database Management": 80,
    "Object-Oriented Programming": 68,
    "Web Development": 70,
  },
  quizzesTaken: 12,
  lastQuizDate: new Date().toISOString(),
  strongTopics: ["Database Management", "Data Structures and Algorithms"],
  weakTopics: ["Operating Systems", "Object-Oriented Programming"]
};

let mockPerformanceHistory: PerformanceHistory[] = [
  { date: "2025-03-15", topic: "Data Structures and Algorithms", score: 65 },
  { date: "2025-03-20", topic: "Data Structures and Algorithms", score: 70 },
  { date: "2025-03-25", topic: "Data Structures and Algorithms", score: 75 },
  { date: "2025-03-10", topic: "Operating Systems", score: 55 },
  { date: "2025-03-18", topic: "Operating Systems", score: 60 },
  { date: "2025-03-26", topic: "Operating Systems", score: 65 },
  { date: "2025-03-12", topic: "Database Management", score: 75 },
  { date: "2025-03-19", topic: "Database Management", score: 78 },
  { date: "2025-03-28", topic: "Database Management", score: 80 },
  { date: "2025-03-14", topic: "Object-Oriented Programming", score: 60 },
  { date: "2025-03-22", topic: "Object-Oriented Programming", score: 65 },
  { date: "2025-03-29", topic: "Object-Oriented Programming", score: 68 },
];

let mockBadges: Badge[] = [
  {
    id: "algorithm-master",
    name: "Algorithm Master",
    icon: "Code",
    description: "Scored above 75% in Data Structures and Algorithms quiz",
    earned: true,
    earnedDate: "2025-03-25"
  },
  {
    id: "sql-expert",
    name: "SQL Expert",
    icon: "Database",
    description: "Scored above 80% in SQL and Database Management quiz",
    earned: true,
    earnedDate: "2025-03-28"
  },
  {
    id: "os-specialist",
    name: "OS Specialist",
    icon: "Cpu",
    description: "Scored above 80% in Operating Systems quiz",
    earned: false
  },
  {
    id: "ai-apprentice",
    name: "AI Apprentice",
    icon: "Brain",
    description: "Completed at least 3 AI and Machine Learning quizzes",
    earned: false
  },
];

// Function to get user performance
export const getUserPerformance = async (userId: string): Promise<UserPerformance> => {
  // In a real app, this would be a fetch to your backend
  console.log(`Fetching performance data for user: ${userId}`);
  return mockUserPerformance;
};

// Function to get performance history
export const getPerformanceHistory = async (userId: string): Promise<PerformanceHistory[]> => {
  // In a real app, this would be a fetch to your backend
  console.log(`Fetching performance history for user: ${userId}`);
  return mockPerformanceHistory;
};

// Function to get user badges
export const getUserBadges = async (userId: string): Promise<Badge[]> => {
  // In a real app, this would be a fetch to your backend
  console.log(`Fetching badges for user: ${userId}`);
  return mockBadges;
};

// Function to update user performance after completing a quiz
export const updateUserPerformance = async (
  userId: string, 
  topic: string, 
  score: number
): Promise<UserPerformance> => {
  // In a real app, this would post to your backend
  console.log(`Updating performance for user: ${userId}, topic: ${topic}, score: ${score}`);
  
  // Update mock data for now
  const currentDate = new Date().toISOString();
  
  // Update topic score
  mockUserPerformance.topicScores[topic] = score;
  
  // Update overall score (average of all topics)
  const topics = Object.keys(mockUserPerformance.topicScores);
  const totalScore = topics.reduce((sum, t) => sum + mockUserPerformance.topicScores[t], 0);
  mockUserPerformance.overallScore = Math.round(totalScore / topics.length);
  
  // Update quizzes taken
  mockUserPerformance.quizzesTaken += 1;
  mockUserPerformance.lastQuizDate = currentDate;
  
  // Update strong and weak topics
  mockUserPerformance.strongTopics = topics
    .filter(t => mockUserPerformance.topicScores[t] >= 75)
    .sort((a, b) => mockUserPerformance.topicScores[b] - mockUserPerformance.topicScores[a])
    .slice(0, 2);
    
  mockUserPerformance.weakTopics = topics
    .filter(t => mockUserPerformance.topicScores[t] < 70)
    .sort((a, b) => mockUserPerformance.topicScores[a] - mockUserPerformance.topicScores[b])
    .slice(0, 2);
  
  // Add to performance history
  mockPerformanceHistory.push({
    date: currentDate,
    topic,
    score
  });
  
  // Check for badges
  if (topic === "Data Structures and Algorithms" && score >= 75) {
    const badge = mockBadges.find(b => b.id === "algorithm-master");
    if (badge && !badge.earned) {
      badge.earned = true;
      badge.earnedDate = currentDate;
      toast({
        title: "New Badge Earned!",
        description: `You've earned the ${badge.name} badge!`,
        variant: "default",
      });
    }
  }
  
  if (topic === "Database Management" && score >= 80) {
    const badge = mockBadges.find(b => b.id === "sql-expert");
    if (badge && !badge.earned) {
      badge.earned = true;
      badge.earnedDate = currentDate;
      toast({
        title: "New Badge Earned!",
        description: `You've earned the ${badge.name} badge!`,
        variant: "default",
      });
    }
  }
  
  if (topic === "Operating Systems" && score >= 80) {
    const badge = mockBadges.find(b => b.id === "os-specialist");
    if (badge && !badge.earned) {
      badge.earned = true;
      badge.earnedDate = currentDate;
      toast({
        title: "New Badge Earned!",
        description: `You've earned the ${badge.name} badge!`,
        variant: "default",
      });
    }
  }
  
  return mockUserPerformance;
};

// Get suggested resources based on user performance
export const getSuggestedResources = async (userId: string): Promise<any[]> => {
  // In a real app, this would be a fetch to your backend
  console.log(`Fetching suggested resources for user: ${userId}`);
  
  // Mock resources based on weak topics
  const weakTopics = mockUserPerformance.weakTopics;
  
  const resourcesByTopic = {
    "Data Structures and Algorithms": [
      {
        title: "Master the Coding Interview: Data Structures + Algorithms",
        type: "course",
        url: "https://www.udemy.com/course/master-the-coding-interview-data-structures-algorithms/",
        description: "Learn how to ace coding interviews by mastering data structures and algorithm concepts."
      },
      {
        title: "GeeksforGeeks DSA Tutorial",
        type: "article",
        url: "https://www.geeksforgeeks.org/data-structures/",
        description: "Comprehensive guide to data structures with examples and practice problems."
      },
      {
        title: "Visualizing Data Structures and Algorithms",
        type: "video",
        url: "https://visualgo.net/en",
        description: "Interactive visualizations of various data structures and algorithms."
      }
    ],
    "Operating Systems": [
      {
        title: "Operating Systems: Three Easy Pieces",
        type: "article",
        url: "http://pages.cs.wisc.edu/~remzi/OSTEP/",
        description: "A comprehensive guide to operating systems concepts."
      },
      {
        title: "MIT OpenCourseWare: Operating Systems",
        type: "video",
        url: "https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/6-828-operating-system-engineering-fall-2012/",
        description: "Free course materials from MIT on operating systems engineering."
      },
      {
        title: "Operating System Concepts Practice Problems",
        type: "practice",
        url: "https://www.geeksforgeeks.org/operating-systems/",
        description: "Practice problems on operating systems concepts."
      }
    ],
    "Database Management": [
      {
        title: "SQL Tutorial - W3Schools",
        type: "article",
        url: "https://www.w3schools.com/sql/",
        description: "Interactive SQL tutorial with examples and exercises."
      },
      {
        title: "Database Design Tutorial",
        type: "video",
        url: "https://www.youtube.com/watch?v=ztHopE5Wnpc",
        description: "Learn database design principles step by step."
      },
      {
        title: "MongoDB University",
        type: "course",
        url: "https://university.mongodb.com/",
        description: "Free courses on MongoDB and NoSQL databases."
      }
    ],
    "Object-Oriented Programming": [
      {
        title: "Object-Oriented Programming in Java",
        type: "course",
        url: "https://www.coursera.org/learn/object-oriented-java",
        description: "Learn object-oriented programming principles using Java."
      },
      {
        title: "Design Patterns: Elements of Reusable Object-Oriented Software",
        type: "article",
        url: "https://refactoring.guru/design-patterns",
        description: "Comprehensive guide to design patterns with examples."
      },
      {
        title: "SOLID Principles of Object-Oriented Design",
        type: "video",
        url: "https://www.pluralsight.com/courses/principles-oo-design",
        description: "Learn the SOLID principles of object-oriented design."
      }
    ]
  };
  
  let suggestedResources: any[] = [];
  
  // Get resources for weak topics
  weakTopics.forEach(topic => {
    if (resourcesByTopic[topic]) {
      suggestedResources = [...suggestedResources, ...resourcesByTopic[topic]];
    }
  });
  
  // If no weak topics or resources, return some general resources
  if (suggestedResources.length === 0) {
    suggestedResources = [
      {
        title: "Cracking the Coding Interview",
        type: "article",
        url: "https://www.amazon.com/Cracking-Coding-Interview-Programming-Questions/dp/0984782850",
        description: "Popular book for preparing for coding interviews."
      },
      {
        title: "LeetCode",
        type: "practice",
        url: "https://leetcode.com/",
        description: "Platform for practicing coding interview questions."
      },
      {
        title: "MIT OpenCourseWare: Introduction to Algorithms",
        type: "video",
        url: "https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/6-006-introduction-to-algorithms-fall-2011/",
        description: "Free course materials from MIT on algorithms."
      }
    ];
  }
  
  return suggestedResources;
};

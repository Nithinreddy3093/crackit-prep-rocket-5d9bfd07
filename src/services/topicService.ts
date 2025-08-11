
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export interface Topic {
  id: string;
  title: string;
  description: string;
  icon: string;
  difficulty: string;
  questionsCount?: number;
  questionCount: number;
  timeLimit: number; // in minutes
  category: string;
  color?: string;
}

// Get all topics
export const getAllTopics = async (): Promise<Topic[]> => {
  try {
    // For now, return mock topics until we implement them in Supabase
    return getMockTopics();
  } catch (error) {
    console.error('Error fetching topics:', error);
    throw new Error('Failed to fetch topics. Please try again later.');
  }
};

// Get a topic by ID
export const getTopicById = async (topicId?: string): Promise<Topic | null> => {
  try {
    if (!topicId) {
      console.error('No topic ID provided');
      return null;
    }

    const topics = getMockTopics();
    return topics.find(topic => topic.id === topicId) || null;
  } catch (error) {
    console.error(`Error fetching topic ${topicId}:`, error);
    throw new Error('Failed to fetch topic. Please try again later.');
  }
};

// Topic configurations with proper metadata
export const TOPIC_CONFIGS: Record<string, Topic> = {
  'dsa': {
    id: 'dsa',
    title: 'Data Structures & Algorithms',
    description: 'Arrays, Linked Lists, Trees, Graphs, Sorting and Searching Algorithms.',
    icon: 'Code',
    difficulty: 'intermediate',
    questionsCount: 25,
    questionCount: 25,
    timeLimit: 38,
    category: 'Computer Science',
    color: 'from-purple-500 to-indigo-600'
  },
  'dbms': {
    id: 'dbms',
    title: 'Database Management',
    description: 'SQL, Normalization, Transactions, RDBMS concepts and queries.',
    icon: 'Database',
    difficulty: 'intermediate',
    questionsCount: 20,
    questionCount: 20,
    timeLimit: 30,
    category: 'Computer Science',
    color: 'from-blue-500 to-cyan-600'
  },
  'os': {
    id: 'os',
    title: 'Operating Systems',
    description: 'Process Management, Memory Management, File Systems, Scheduling.',
    icon: 'Cpu',
    difficulty: 'advanced',
    questionsCount: 18,
    questionCount: 18,
    timeLimit: 27,
    category: 'Computer Science',
    color: 'from-gray-600 to-gray-800'
  },
  'oops': {
    id: 'oops',
    title: 'Object-Oriented Programming',
    description: 'Classes, Objects, Inheritance, Polymorphism, Encapsulation, Abstraction.',
    icon: 'Layers',
    difficulty: 'beginner',
    questionsCount: 15,
    questionCount: 15,
    timeLimit: 23,
    category: 'Programming',
    color: 'from-green-500 to-emerald-600'
  },
  'web-development': {
    id: 'web-development',
    title: 'Web Development',
    description: 'HTML, CSS, JavaScript, React, RESTful APIs, and web architecture.',
    icon: 'Globe',
    difficulty: 'beginner',
    questionsCount: 22,
    questionCount: 22,
    timeLimit: 33,
    category: 'Programming',
    color: 'from-amber-500 to-orange-600'
  },
  'ai-ml': {
    id: 'ai-ml',
    title: 'AI & Machine Learning',
    description: 'Neural Networks, Supervised/Unsupervised Learning, NLP, Computer Vision.',
    icon: 'Brain',
    difficulty: 'advanced',
    questionsCount: 12,
    questionCount: 12,
    timeLimit: 18,
    category: 'Technology',
    color: 'from-red-500 to-pink-600'
  }
};

// Mock topics (will be replaced by database queries later)
const getMockTopics = (): Topic[] => {
  return Object.values(TOPIC_CONFIGS);
};


import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export interface Topic {
  id: string;
  title: string;
  description: string;
  icon: string;
  difficulty: string;
  questionsCount?: number;
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

// Mock topics (will be replaced by database queries later)
const getMockTopics = (): Topic[] => {
  return [
    {
      id: 'dsa',
      title: 'Data Structures & Algorithms',
      description: 'Arrays, Linked Lists, Trees, Graphs, Sorting and Searching Algorithms.',
      icon: 'Code',
      difficulty: 'intermediate',
      questionsCount: 25,
      color: 'from-purple-500 to-indigo-600'
    },
    {
      id: 'dbms',
      title: 'Database Management',
      description: 'SQL, Normalization, Transactions, RDBMS concepts and queries.',
      icon: 'Database',
      difficulty: 'intermediate',
      questionsCount: 20,
      color: 'from-blue-500 to-cyan-600'
    },
    {
      id: 'os',
      title: 'Operating Systems',
      description: 'Process Management, Memory Management, File Systems, Scheduling.',
      icon: 'Cpu',
      difficulty: 'advanced',
      questionsCount: 18,
      color: 'from-gray-600 to-gray-800'
    },
    {
      id: 'oops',
      title: 'Object-Oriented Programming',
      description: 'Classes, Objects, Inheritance, Polymorphism, Encapsulation, Abstraction.',
      icon: 'Layers',
      difficulty: 'beginner',
      questionsCount: 15,
      color: 'from-green-500 to-emerald-600'
    },
    {
      id: 'web',
      title: 'Web Development',
      description: 'HTML, CSS, JavaScript, React, RESTful APIs, and web architecture.',
      icon: 'Globe',
      difficulty: 'beginner',
      questionsCount: 22,
      color: 'from-amber-500 to-orange-600'
    },
    {
      id: 'ai',
      title: 'AI & Machine Learning',
      description: 'Neural Networks, Supervised/Unsupervised Learning, NLP, Computer Vision.',
      icon: 'Brain',
      difficulty: 'advanced',
      questionsCount: 12,
      color: 'from-red-500 to-pink-600'
    }
  ];
};

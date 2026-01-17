
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
  },
  // Company-specific mock test topics
  'infosys-prep': {
    id: 'infosys-prep',
    title: 'Infosys Mock Test',
    description: 'InfyTQ pattern: Aptitude, Reasoning, Java, SQL, and Pseudocode questions.',
    icon: 'Building2',
    difficulty: 'intermediate',
    questionsCount: 15,
    questionCount: 15,
    timeLimit: 45,
    category: 'Company Prep',
    color: 'from-blue-600 to-blue-800'
  },
  'tcs-nqt': {
    id: 'tcs-nqt',
    title: 'TCS NQT Mock Test',
    description: 'TCS National Qualifier Test: Numerical, Verbal, Reasoning, Programming.',
    icon: 'Building2',
    difficulty: 'intermediate',
    questionsCount: 15,
    questionCount: 15,
    timeLimit: 50,
    category: 'Company Prep',
    color: 'from-indigo-600 to-purple-700'
  },
  'wipro-nlth': {
    id: 'wipro-nlth',
    title: 'Wipro NLTH Mock Test',
    description: 'Wipro pattern: Aptitude, Essay Writing, Coding, and Technical MCQs.',
    icon: 'Building2',
    difficulty: 'intermediate',
    questionsCount: 15,
    questionCount: 15,
    timeLimit: 45,
    category: 'Company Prep',
    color: 'from-teal-500 to-green-600'
  },
  'accenture-prep': {
    id: 'accenture-prep',
    title: 'Accenture Mock Test',
    description: 'Cognitive Assessment, Technical MCQs, and Coding problems.',
    icon: 'Building2',
    difficulty: 'intermediate',
    questionsCount: 15,
    questionCount: 15,
    timeLimit: 40,
    category: 'Company Prep',
    color: 'from-purple-500 to-violet-700'
  },
  'cognizant-genC': {
    id: 'cognizant-genC',
    title: 'Cognizant GenC Mock Test',
    description: 'GenC pattern: Aptitude, Automata Fix, Hand Coding, and Technical.',
    icon: 'Building2',
    difficulty: 'intermediate',
    questionsCount: 15,
    questionCount: 15,
    timeLimit: 45,
    category: 'Company Prep',
    color: 'from-sky-500 to-blue-600'
  },
  'aptitude': {
    id: 'aptitude',
    title: 'General Aptitude',
    description: 'Quantitative Aptitude, Logical Reasoning, Verbal Ability for placements.',
    icon: 'Calculator',
    difficulty: 'beginner',
    questionsCount: 15,
    questionCount: 15,
    timeLimit: 30,
    category: 'Aptitude',
    color: 'from-yellow-500 to-orange-500'
  }
};

// Mock topics (will be replaced by database queries later)
const getMockTopics = (): Topic[] => {
  return Object.values(TOPIC_CONFIGS);
};

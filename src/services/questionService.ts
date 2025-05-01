
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  topic_id: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

// Get questions by topic ID
export const getQuestionsByTopicId = async (topicId?: string): Promise<Question[]> => {
  try {
    if (!topicId) {
      console.error('No topic ID provided');
      return [];
    }

    // For now, return mock questions until we implement them in Supabase
    // In a real implementation, this would fetch from Supabase
    const mockQuestions = getMockQuestions(topicId);
    return mockQuestions;
  } catch (error) {
    console.error(`Error fetching questions for topic ${topicId}:`, error);
    throw new Error('Failed to fetch questions. Please try again later.');
  }
};

// Mock questions by topic (will be replaced by database queries later)
const getMockQuestions = (topicId: string): Question[] => {
  const topics: Record<string, Question[]> = {
    'dsa': [
      {
        id: 'dsa-1',
        text: 'What is the time complexity of binary search?',
        options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(n²)'],
        correctAnswer: 'O(log n)',
        explanation: 'Binary search repeatedly divides the search interval in half, resulting in logarithmic time complexity.',
        topic_id: 'dsa',
        difficulty: 'intermediate'
      },
      {
        id: 'dsa-2',
        text: 'Which data structure operates on a LIFO (Last In First Out) principle?',
        options: ['Queue', 'Stack', 'Tree', 'Graph'],
        correctAnswer: 'Stack',
        explanation: 'A stack follows the Last In First Out principle where the last element added is the first one to be removed.',
        topic_id: 'dsa',
        difficulty: 'beginner'
      },
      {
        id: 'dsa-3',
        text: 'What is the worst-case time complexity for quick sort?',
        options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(n²)'],
        correctAnswer: 'O(n²)',
        explanation: 'Quick sort has a worst-case time complexity of O(n²) when the pivot selection is unbalanced.',
        topic_id: 'dsa',
        difficulty: 'intermediate'
      }
    ],
    'dbms': [
      {
        id: 'dbms-1',
        text: 'What does ACID stand for in database transactions?',
        options: [
          'Atomicity, Consistency, Isolation, Durability',
          'Association, Completion, Isolation, Definition',
          'Atomicity, Completion, Integrity, Durability',
          'Association, Consistency, Integrity, Definition'
        ],
        correctAnswer: 'Atomicity, Consistency, Isolation, Durability',
        explanation: 'ACID properties ensure reliable processing of database transactions.',
        topic_id: 'dbms',
        difficulty: 'intermediate'
      },
      {
        id: 'dbms-2',
        text: 'Which normal form eliminates transitive dependencies?',
        options: ['1NF', '2NF', '3NF', 'BCNF'],
        correctAnswer: '3NF',
        explanation: 'Third Normal Form (3NF) eliminates transitive dependencies, where non-key attributes depend on other non-key attributes.',
        topic_id: 'dbms',
        difficulty: 'advanced'
      },
      {
        id: 'dbms-3',
        text: 'What SQL command would you use to retrieve data from a database?',
        options: ['INSERT', 'UPDATE', 'SELECT', 'DELETE'],
        correctAnswer: 'SELECT',
        explanation: 'The SELECT statement is used to query and retrieve data from database tables.',
        topic_id: 'dbms',
        difficulty: 'beginner'
      }
    ],
    'os': [
      {
        id: 'os-1',
        text: 'What is thrashing in an operating system?',
        options: [
          'A type of malware attack',
          'Excessive paging causing performance degradation',
          'A method of disk defragmentation',
          'CPU running at maximum capacity'
        ],
        correctAnswer: 'Excessive paging causing performance degradation',
        explanation: 'Thrashing occurs when the system spends more time paging than executing processes, severely degrading performance.',
        topic_id: 'os',
        difficulty: 'advanced'
      },
      {
        id: 'os-2',
        text: 'Which scheduling algorithm gives CPU time to the process with the shortest expected processing time?',
        options: ['First-Come, First-Served', 'Round Robin', 'Shortest Job First', 'Priority Scheduling'],
        correctAnswer: 'Shortest Job First',
        explanation: 'Shortest Job First (SJF) allocates the CPU to the process with the smallest expected processing time.',
        topic_id: 'os',
        difficulty: 'intermediate'
      },
      {
        id: 'os-3',
        text: 'What is a deadlock in operating systems?',
        options: [
          'When the CPU is idle',
          'When two or more processes are waiting indefinitely for resources held by each other',
          'When a process is terminated unexpectedly',
          'When virtual memory is full'
        ],
        correctAnswer: 'When two or more processes are waiting indefinitely for resources held by each other',
        explanation: 'A deadlock occurs when processes are unable to proceed because each is waiting for resources held by another process.',
        topic_id: 'os',
        difficulty: 'intermediate'
      }
    ]
  };

  // Default to DSA if topic doesn't exist in our mock data
  return topics[topicId] || topics['dsa'];
};

// Get a single question by ID
export const getQuestionById = async (questionId: string): Promise<Question | null> => {
  try {
    // This would be a Supabase query in a real implementation
    // For now, search through all mock questions
    for (const topicId of Object.keys(getMockQuestions('dummy'))) {
      const questions = getMockQuestions(topicId);
      const question = questions.find(q => q.id === questionId);
      if (question) return question;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching question ${questionId}:`, error);
    throw new Error('Failed to fetch question. Please try again later.');
  }
};

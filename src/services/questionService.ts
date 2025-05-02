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

// Get questions by topic ID with session tracking and difficulty options
export const getQuestionsByTopicId = async (
  topicId?: string, 
  excludedIds: string[] = [],
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'mixed' = 'mixed',
  count: number = 10
): Promise<Question[]> => {
  try {
    if (!topicId) {
      console.error('No topic ID provided');
      return [];
    }

    // For now, return mock questions until we implement them in Supabase
    // In a real implementation, this would fetch from Supabase with filters
    let allQuestions = getMockQuestions(topicId);
    
    // Filter out previously seen questions
    if (excludedIds.length > 0) {
      allQuestions = allQuestions.filter(q => !excludedIds.includes(q.id));
    }
    
    // Filter by difficulty if specified (skip filtering if mixed)
    if (difficulty !== 'mixed') {
      allQuestions = allQuestions.filter(q => q.difficulty === difficulty);
    }
    
    // If we don't have enough questions after filtering, fall back to all questions
    // This ensures we always return some questions even if the user has seen them before
    if (allQuestions.length < count) {
      console.warn('Not enough unique questions available, including some repeated questions');
      allQuestions = getMockQuestions(topicId);
      
      // Still filter by difficulty if specified
      if (difficulty !== 'mixed') {
        allQuestions = allQuestions.filter(q => q.difficulty === difficulty);
      }
    }
    
    // Randomize and limit to requested count
    return shuffleArray(allQuestions).slice(0, count);
  } catch (error) {
    console.error(`Error fetching questions for topic ${topicId}:`, error);
    throw new Error('Failed to fetch questions. Please try again later.');
  }
};

// Shuffle array using Fisher-Yates algorithm
const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Get questions from multiple topics for a diverse quiz
export const getQuestionsFromMultipleTopics = async (
  excludedIds: string[] = [],
  count: number = 10
): Promise<Question[]> => {
  try {
    // Get all available topics
    const topicIds = ['dsa', 'dbms', 'os', 'oops', 'web', 'ai'];
    
    let allQuestions: Question[] = [];
    
    // Gather questions from each topic
    for (const topicId of topicIds) {
      const topicQuestions = getMockQuestions(topicId);
      allQuestions = [...allQuestions, ...topicQuestions];
    }
    
    // Filter out previously seen questions
    if (excludedIds.length > 0) {
      allQuestions = allQuestions.filter(q => !excludedIds.includes(q.id));
    }
    
    // Ensure diversity by randomly selecting questions
    return shuffleArray(allQuestions).slice(0, count);
  } catch (error) {
    console.error('Error fetching multi-topic questions:', error);
    throw new Error('Failed to fetch diverse questions. Please try again later.');
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
      },
      {
        id: 'dsa-4',
        text: 'Which of the following is not a linear data structure?',
        options: ['Array', 'Linked List', 'Queue', 'Tree'],
        correctAnswer: 'Tree',
        explanation: 'Trees are hierarchical data structures with a root node and child nodes, making them non-linear unlike arrays, linked lists, and queues.',
        topic_id: 'dsa',
        difficulty: 'beginner'
      },
      {
        id: 'dsa-5',
        text: 'What data structure would you use for implementing a breadth-first search?',
        options: ['Stack', 'Queue', 'Hash Table', 'Binary Search Tree'],
        correctAnswer: 'Queue',
        explanation: 'Breadth-first search uses a queue to keep track of the next vertices to be explored, processing nodes level by level.',
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
      },
      {
        id: 'dbms-4',
        text: 'What is a foreign key?',
        options: [
          'A key used for encryption',
          'A key that uniquely identifies a row',
          'A key that refers to the primary key in another table',
          'A key used for indexing'
        ],
        correctAnswer: 'A key that refers to the primary key in another table',
        explanation: 'A foreign key is a field that establishes a relationship between two tables by referencing the primary key of another table.',
        topic_id: 'dbms',
        difficulty: 'beginner'
      },
      {
        id: 'dbms-5',
        text: 'Which of the following is not a type of database join?',
        options: ['Inner Join', 'Outer Join', 'Partial Join', 'Cross Join'],
        correctAnswer: 'Partial Join',
        explanation: 'Partial Join is not a standard type of database join. The standard joins are Inner Join, Left/Right/Full Outer Join, and Cross Join.',
        topic_id: 'dbms',
        difficulty: 'intermediate'
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
      },
      {
        id: 'os-4',
        text: 'What is the purpose of a semaphore in operating systems?',
        options: [
          'To manage file permissions',
          'To control access to shared resources',
          'To detect hardware failures',
          'To encrypt sensitive data'
        ],
        correctAnswer: 'To control access to shared resources',
        explanation: 'Semaphores are synchronization tools used to control access to shared resources in a multi-process environment.',
        topic_id: 'os',
        difficulty: 'intermediate'
      },
      {
        id: 'os-5',
        text: 'Which of the following is not a type of memory in an operating system?',
        options: ['Cache', 'RAM', 'ROM', 'Virtual Memory', 'Sequential Memory'],
        correctAnswer: 'Sequential Memory',
        explanation: 'Sequential Memory is not a standard memory type in operating systems. Common types include Cache, RAM, ROM, and Virtual Memory.',
        topic_id: 'os',
        difficulty: 'beginner'
      }
    ],
    'oops': [
      {
        id: 'oops-1',
        text: 'What is encapsulation in OOP?',
        options: [
          'The ability of a class to inherit from multiple classes',
          'The concept of bundling data and methods that operate on that data within a single unit',
          'The ability of objects to take on many forms',
          'The process of hiding implementation details'
        ],
        correctAnswer: 'The concept of bundling data and methods that operate on that data within a single unit',
        explanation: 'Encapsulation is the bundling of data and methods into a single unit (class) and restricting access to some of the object\'s components.',
        topic_id: 'oops',
        difficulty: 'beginner'
      },
      {
        id: 'oops-2',
        text: 'What is polymorphism in OOP?',
        options: [
          'The concept of having a single method or operator work in different ways depending on what object it is acting upon',
          'The ability to hide certain details and show only essential information',
          'The concept of bundling data and methods together',
          'The ability of a class to inherit from multiple classes'
        ],
        correctAnswer: 'The concept of having a single method or operator work in different ways depending on what object it is acting upon',
        explanation: 'Polymorphism allows methods to do different things based on the object it is acting upon, enabling one interface to be used for a general class of actions.',
        topic_id: 'oops',
        difficulty: 'intermediate'
      },
      {
        id: 'oops-3',
        text: 'What is method overloading in OOP?',
        options: [
          'Creating methods with the same name but different parameters',
          'Redefining a method in a derived class',
          'Hiding variables in a class',
          'Creating multiple instances of a class'
        ],
        correctAnswer: 'Creating methods with the same name but different parameters',
        explanation: 'Method overloading allows a class to have multiple methods with the same name but different parameters, providing different implementations based on the arguments passed.',
        topic_id: 'oops',
        difficulty: 'intermediate'
      },
      {
        id: 'oops-4',
        text: 'What is inheritance in OOP?',
        options: [
          'The process of hiding implementation details',
          'The mechanism by which one class acquires the properties of another class',
          'The concept of bundling data and methods together',
          'The ability of objects to take on many forms'
        ],
        correctAnswer: 'The mechanism by which one class acquires the properties of another class',
        explanation: 'Inheritance allows a class to inherit properties and behavior from another class, promoting code reuse and establishing a relationship between a more general class and a more specialized class.',
        topic_id: 'oops',
        difficulty: 'beginner'
      },
      {
        id: 'oops-5',
        text: 'What is an abstract class in OOP?',
        options: [
          'A class that cannot be instantiated and may contain abstract methods',
          'A class with only static methods',
          'A class that can be instantiated multiple times',
          'A class with only private methods'
        ],
        correctAnswer: 'A class that cannot be instantiated and may contain abstract methods',
        explanation: 'An abstract class is a restricted class that cannot be used to create objects. It must be inherited from by another class, and it can have abstract methods that must be implemented by its subclasses.',
        topic_id: 'oops',
        difficulty: 'advanced'
      }
    ],
    'web': [
      {
        id: 'web-1',
        text: 'What does CORS stand for?',
        options: ['Cross-Origin Resource Sharing', 'Cross-Origin Request Security', 'Connected Object Response System', 'Client-Origin Resource Server'],
        correctAnswer: 'Cross-Origin Resource Sharing',
        explanation: 'CORS is a security feature implemented by browsers that allows or restricts web applications running at one origin to request resources from a different origin.',
        topic_id: 'web',
        difficulty: 'intermediate'
      },
      {
        id: 'web-2',
        text: 'Which of the following is NOT a JavaScript framework or library?',
        options: ['Angular', 'React', 'Vue', 'Django'],
        correctAnswer: 'Django',
        explanation: 'Django is a Python web framework, not a JavaScript framework or library. Angular, React, and Vue are all JavaScript frameworks/libraries.',
        topic_id: 'web',
        difficulty: 'beginner'
      },
      {
        id: 'web-3',
        text: 'What does the "A" stand for in AJAX?',
        options: ['Application', 'Asynchronous', 'Active', 'Automated'],
        correctAnswer: 'Asynchronous',
        explanation: 'AJAX stands for Asynchronous JavaScript And XML. The "Asynchronous" part refers to the ability to make requests to the server without reloading the page.',
        topic_id: 'web',
        difficulty: 'beginner'
      },
      {
        id: 'web-4',
        text: 'Which HTML element is used to define the structure of an HTML document, including the title, scripts, styles, meta information, etc.?',
        options: ['<body>', '<title>', '<head>', '<meta>'],
        correctAnswer: '<head>',
        explanation: 'The <head> element contains meta-information about the document, such as its title, scripts, and style sheets.',
        topic_id: 'web',
        difficulty: 'beginner'
      },
      {
        id: 'web-5',
        text: 'Which of the following is a stateless protocol?',
        options: ['FTP', 'Telnet', 'HTTP', 'SSH'],
        correctAnswer: 'HTTP',
        explanation: 'HTTP is a stateless protocol, meaning each request from a client to a server is treated as a new request, without any knowledge of previous requests.',
        topic_id: 'web',
        difficulty: 'intermediate'
      }
    ],
    'ai': [
      {
        id: 'ai-1',
        text: 'What is the difference between supervised and unsupervised learning?',
        options: [
          'Supervised learning requires labeled data while unsupervised learning does not',
          'Supervised learning is faster than unsupervised learning',
          'Supervised learning uses neural networks while unsupervised learning uses decision trees',
          'Supervised learning is used for classification while unsupervised learning is only for regression'
        ],
        correctAnswer: 'Supervised learning requires labeled data while unsupervised learning does not',
        explanation: 'In supervised learning, the algorithm learns from labeled training data to make predictions or decisions, while unsupervised learning works with unlabeled data to find patterns or structures.',
        topic_id: 'ai',
        difficulty: 'intermediate'
      },
      {
        id: 'ai-2',
        text: 'What is overfitting in machine learning?',
        options: [
          'When a model performs poorly on both training and testing data',
          'When a model performs well on training data but poorly on unseen data',
          'When a model is too simple to capture the underlying patterns',
          'When a model takes too long to train'
        ],
        correctAnswer: 'When a model performs well on training data but poorly on unseen data',
        explanation: 'Overfitting occurs when a model learns the training data too well, including its noise and outliers, resulting in poor generalization to new, unseen data.',
        topic_id: 'ai',
        difficulty: 'intermediate'
      },
      {
        id: 'ai-3',
        text: 'What is a neural network?',
        options: [
          'A computer system modeled after the human brain',
          'A database management system',
          'A type of computer virus',
          'A network security protocol'
        ],
        correctAnswer: 'A computer system modeled after the human brain',
        explanation: 'A neural network is a computational model inspired by the way biological neural networks in the human brain process information, consisting of layers of interconnected nodes or "neurons".',
        topic_id: 'ai',
        difficulty: 'beginner'
      },
      {
        id: 'ai-4',
        text: 'What is the purpose of the activation function in a neural network?',
        options: [
          'To initialize the weights of the network',
          'To introduce non-linearity into the network\'s output',
          'To normalize the input data',
          'To reduce the learning rate during training'
        ],
        correctAnswer: 'To introduce non-linearity into the network\'s output',
        explanation: 'Activation functions introduce non-linear properties to neural networks, enabling them to learn complex patterns and solve more complicated problems that linear models cannot.',
        topic_id: 'ai',
        difficulty: 'intermediate'
      },
      {
        id: 'ai-5',
        text: 'What is K-means clustering used for?',
        options: [
          'Classification of labeled data',
          'Grouping unlabeled data into clusters',
          'Predicting continuous values',
          'Feature extraction from images'
        ],
        correctAnswer: 'Grouping unlabeled data into clusters',
        explanation: 'K-means clustering is an unsupervised learning algorithm used to partition data into K distinct clusters based on similarity, without requiring labeled data.',
        topic_id: 'ai',
        difficulty: 'intermediate'
      }
    ]
  };

  return topics[topicId] || [];
};

// Get a single question by ID
export const getQuestionById = async (questionId: string): Promise<Question | null> => {
  try {
    // This would be a Supabase query in a real implementation
    // For now, search through all mock questions
    const topicIds = ['dsa', 'dbms', 'os', 'oops', 'web', 'ai'];
    for (const topicId of topicIds) {
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

// Generate unique questions for a user session
export const generateUniqueQuestionsForSession = async (
  userId: string | undefined,
  topicId: string | undefined,
  previouslySeenQuestionIds: string[] = []
): Promise<Question[]> => {
  try {
    // If topicId is specified, get questions for that topic
    // Otherwise, get questions from multiple topics
    let questions: Question[];
    
    if (topicId) {
      questions = await getQuestionsByTopicId(topicId, previouslySeenQuestionIds, 'mixed', 10);
    } else {
      questions = await getQuestionsFromMultipleTopics(previouslySeenQuestionIds, 10);
    }
    
    // Ensure we have at least 10 questions
    if (questions.length < 10) {
      // Fall back to ignoring the previously seen questions filter
      console.warn('Not enough unique questions available, generating a mixed set');
      if (topicId) {
        questions = await getQuestionsByTopicId(topicId, [], 'mixed', 10);
      } else {
        questions = await getQuestionsFromMultipleTopics([], 10);
      }
    }
    
    return questions;
  } catch (error) {
    console.error('Error generating unique questions:', error);
    throw new Error('Failed to generate unique questions. Please try again later.');
  }
};

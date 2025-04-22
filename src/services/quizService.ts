import { generateAIFeedback } from './geminiService';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

// Extended mock questions for various topics
const MOCK_QUESTIONS: Record<string, Question[]> = {
  "Data Structures and Algorithms": [
    {
      id: 1,
      question: "What is the time complexity of binary search?",
      options: ["O(n)", "O(log n)", "O(n log n)", "O(n²)"],
      correctAnswer: 1,
      explanation: "Binary search has a time complexity of O(log n) because it divides the search space in half with each iteration."
    },
    {
      id: 2,
      question: "Which data structure operates on a LIFO (Last In, First Out) principle?",
      options: ["Queue", "Stack", "Linked List", "Binary Tree"],
      correctAnswer: 1,
      explanation: "A stack follows the Last In, First Out (LIFO) principle, where the last element added is the first one to be removed."
    },
    {
      id: 3,
      question: "Which of the following sorting algorithms has the worst-case time complexity of O(n²)?",
      options: ["Merge Sort", "Quick Sort", "Bubble Sort", "Heap Sort"],
      correctAnswer: 2,
      explanation: "Bubble Sort has a worst-case time complexity of O(n²) as it compares adjacent elements and swaps them if they are in the wrong order."
    },
    {
      id: 4,
      question: "What is the space complexity of depth-first search?",
      options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
      correctAnswer: 2,
      explanation: "Depth-first search has a space complexity of O(n) in the worst case due to the recursion stack or explicit stack used to track visited nodes."
    },
    {
      id: 5,
      question: "Which data structure is most suitable for implementing a priority queue?",
      options: ["Array", "Linked List", "Heap", "Hash Table"],
      correctAnswer: 2,
      explanation: "A heap is most suitable for implementing a priority queue because it efficiently supports insertion and deletion of elements based on priority."
    }
  ],
  "Object-Oriented Programming": [
    {
      id: 1,
      question: "What is encapsulation in OOP?",
      options: [
        "The ability of a class to inherit from multiple classes",
        "The concept of bundling data and methods that operate on that data within a single unit",
        "The ability of objects to take on many forms",
        "The process of hiding implementation details"
      ],
      correctAnswer: 1,
      explanation: "Encapsulation is the bundling of data and methods that operate on that data within a single unit (class), often including information hiding."
    },
    {
      id: 2,
      question: "What is inheritance in OOP?",
      options: [
        "The concept of bundling data and methods together",
        "The ability of a class to inherit properties and behaviors from another class",
        "The ability to create multiple instances of a class",
        "The process of defining multiple methods with the same name"
      ],
      correctAnswer: 1,
      explanation: "Inheritance is a mechanism where a new class (derived class) can inherit properties and behaviors from an existing class (base class)."
    },
    {
      id: 3,
      question: "What is polymorphism in OOP?",
      options: [
        "The ability to create multiple instances of a class",
        "The concept of bundling data and methods together",
        "The ability of objects to take on many forms",
        "The process of hiding implementation details"
      ],
      correctAnswer: 2,
      explanation: "Polymorphism is the ability of objects to take on many forms, allowing objects of different classes to be treated as objects of a common superclass."
    },
    {
      id: 4,
      question: "What is abstraction in OOP?",
      options: [
        "The process of hiding implementation details while showing only functionality",
        "The ability of a class to inherit from multiple classes",
        "The concept of bundling data and methods together",
        "The ability to create multiple instances of a class"
      ],
      correctAnswer: 0,
      explanation: "Abstraction is the process of hiding complex implementation details and showing only the necessary features of an object."
    },
    {
      id: 5,
      question: "What is a constructor in OOP?",
      options: [
        "A method used to destroy objects",
        "A special method used to initialize objects",
        "A method used to copy objects",
        "A method used to compare objects"
      ],
      correctAnswer: 1,
      explanation: "A constructor is a special method that is automatically called when an object is created, used to initialize the object's attributes."
    }
  ],
  "Web Development": [
    {
      id: 1,
      question: "What does HTML stand for?",
      options: [
        "Hyper Text Markup Language",
        "High Tech Multi Language",
        "Hyper Transfer Markup Language",
        "Home Tool Markup Language"
      ],
      correctAnswer: 0,
      explanation: "HTML stands for Hyper Text Markup Language, which is the standard markup language for creating web pages."
    },
    {
      id: 2,
      question: "Which CSS property is used to control the spacing between elements?",
      options: ["spacing", "margin", "padding", "border"],
      correctAnswer: 1,
      explanation: "The margin property in CSS is used to control the spacing between elements by creating space around elements, outside of any defined borders."
    },
    {
      id: 3,
      question: "Which of the following is NOT a JavaScript framework/library?",
      options: ["React", "Angular", "Vue", "Django"],
      correctAnswer: 3,
      explanation: "Django is a high-level Python web framework, not a JavaScript framework or library."
    },
    {
      id: 4,
      question: "What is the purpose of the 'viewport' meta tag in HTML?",
      options: [
        "To set the background color of the web page",
        "To define the size and scale of the viewport",
        "To link external CSS files",
        "To set the character encoding"
      ],
      correctAnswer: 1,
      explanation: "The viewport meta tag is used to control the width and scaling of the viewport, which is essential for responsive web design."
    },
    {
      id: 5,
      question: "What is the correct way to write a JavaScript array?",
      options: [
        "var colors = 'red', 'green', 'blue'",
        "var colors = (1:'red', 2:'green', 3:'blue')",
        "var colors = ['red', 'green', 'blue']",
        "var colors = 1=('red'), 2=('green'), 3=('blue')"
      ],
      correctAnswer: 2,
      explanation: "In JavaScript, arrays are written with square brackets, and array items are separated by commas."
    }
  ],
  "Operating Systems": [
    {
      id: 1,
      question: "What is the main purpose of an operating system?",
      options: [
        "To run applications",
        "To manage hardware resources",
        "To connect to the internet",
        "To store files"
      ],
      correctAnswer: 1,
      explanation: "The main purpose of an operating system is to manage computer hardware resources and provide common services for computer programs."
    },
    {
      id: 2,
      question: "What is a process in the context of operating systems?",
      options: [
        "A program in execution",
        "A part of the memory",
        "A type of file system",
        "A hardware component"
      ],
      correctAnswer: 0,
      explanation: "A process is a program in execution. It is the unit of work in most computer systems and consists of the program code, current activity, and related resources."
    },
    {
      id: 3,
      question: "What is virtual memory?",
      options: [
        "A type of RAM",
        "A technique that uses disk space as an extension of RAM",
        "A special type of cache memory",
        "Memory used by virtual machines only"
      ],
      correctAnswer: 1,
      explanation: "Virtual memory is a memory management technique that uses disk space as an extension of RAM, allowing programs to use more memory than physically available."
    },
    {
      id: 4,
      question: "What is a deadlock in operating systems?",
      options: [
        "A situation where a computer crashes",
        "A situation where processes are unable to proceed because each is waiting for resources held by another",
        "A type of computer virus",
        "When the CPU usage is 100%"
      ],
      correctAnswer: 1,
      explanation: "A deadlock is a situation where two or more processes are unable to proceed because each is waiting for resources held by another process in the group."
    },
    {
      id: 5,
      question: "What is the purpose of a file system in an operating system?",
      options: [
        "To secure the operating system from viruses",
        "To organize and manage files on storage devices",
        "To execute programs faster",
        "To connect to the internet"
      ],
      correctAnswer: 1,
      explanation: "A file system is used to organize and store files on storage devices, providing a way to organize data in a hierarchical structure of directories or folders."
    }
  ],
  "Database Management": [
    {
      id: 1,
      question: "What is the highest normal form in database normalization?",
      options: ["1NF", "2NF", "3NF", "BCNF"],
      correctAnswer: 3,
      explanation: "BCNF (Boyce-Codd Normal Form) is a higher normal form than 3NF. While 5NF and 6NF exist, BCNF is often considered the highest practical normal form in most database designs."
    },
    {
      id: 2,
      question: "Which of the following is NOT a type of database index?",
      options: ["B-Tree index", "Hash index", "Matrix index", "Bitmap index"],
      correctAnswer: 2,
      explanation: "Matrix index is not a standard type of database index. Common index types include B-Tree, Hash, Bitmap, and Full-text indices."
    },
    {
      id: 3,
      question: "What does ACID stand for in database transactions?",
      options: [
        "Atomicity, Consistency, Isolation, Durability",
        "Availability, Consistency, Integration, Durability",
        "Atomicity, Concurrency, Integrity, Dependability",
        "Automation, Consistency, Isolation, Durability"
      ],
      correctAnswer: 0,
      explanation: "ACID stands for Atomicity, Consistency, Isolation, and Durability, which are the key properties that guarantee reliable processing of database transactions."
    }
  ],
  "Cyber Security": [
    {
      id: 1,
      question: "What is a man-in-the-middle attack?",
      options: [
        "A type of DoS attack that floods a server with traffic",
        "An attack where an unauthorized party positions themselves between communications",
        "A type of malware that encrypts files and demands ransom",
        "A brute force attack against user passwords"
      ],
      correctAnswer: 1,
      explanation: "A man-in-the-middle attack occurs when an attacker secretly intercepts and possibly alters communications between two parties who believe they are directly communicating with each other."
    },
    {
      id: 2,
      question: "What is the primary purpose of a firewall?",
      options: [
        "To detect and remove viruses",
        "To monitor network traffic for suspicious activity",
        "To control incoming and outgoing network traffic based on predetermined security rules",
        "To encrypt data during transmission"
      ],
      correctAnswer: 2,
      explanation: "A firewall's primary purpose is to establish a barrier between a trusted internal network and untrusted external networks, controlling traffic based on security rules."
    }
  ]
};

// Generate difficulty-specific prompts for AI question generation
const generatePromptForTopic = (topic: string, difficulty: string = 'intermediate'): string => {
  const difficultyGuide = {
    beginner: "fundamental concepts, basic definitions, and simple applications",
    intermediate: "practical applications, moderate complexity scenarios, and standard techniques",
    advanced: "complex problems, edge cases, optimization techniques, and advanced concepts"
  }[difficulty];

  return `
    Generate a multiple-choice question on ${topic} with exactly 4 options and one correct answer.
    The question should test knowledge of ${difficultyGuide}.
    The question should be specific, technically accurate, and clear.
    
    Format your response as JSON with the following structure:
    {
      "question": "The complete question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0, // Index of correct answer (0-3)
      "explanation": "Detailed explanation of why the answer is correct and why others are wrong"
    }
  `;
};

// Function to generate questions with improved AI prompting
export const generateQuestions = async (topic: string, difficulty: string = 'intermediate'): Promise<Question[]> => {
  console.log(`Generating questions for topic: ${topic} at ${difficulty} difficulty`);
  
  try {
    // If we have mock questions for this topic, use them as a fallback
    const mockQuestionsForTopic = MOCK_QUESTIONS[topic];
    
    // In a real implementation, you would:
    // 1. Check if we have cached questions for this topic+difficulty
    // 2. If not, call AI API with better prompting
    // 3. Cache the results for future use
    // 4. Return the AI-generated questions
    
    // For now, return mock questions based on the topic if available
    if (mockQuestionsForTopic) {
      return mockQuestionsForTopic;
    }
    
    // Default to DSA questions if the topic doesn't match
    return MOCK_QUESTIONS["Data Structures and Algorithms"];
  } catch (error) {
    console.error("Error generating questions:", error);
    // Always fall back to mock questions if there's an error
    return MOCK_QUESTIONS["Data Structures and Algorithms"];
  }
};

// We'll use the existing geminiService.ts for AI feedback analysis

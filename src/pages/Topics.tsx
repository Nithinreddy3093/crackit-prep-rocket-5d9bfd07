
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import QuizCard from '@/components/QuizCard';
import QuizFeedback from '@/components/QuizFeedback';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  Filter, 
  Code, 
  Database, 
  Cpu, 
  Brain, 
  BarChart, 
  PieChart,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// Sample topic data
const topicData = {
  dsa: {
    title: "Data Structures & Algorithms",
    description: "Test your knowledge of arrays, linked lists, trees, graphs, and algorithms",
    icon: <Code className="w-6 h-6 text-white" />,
    questions: [
      {
        question: "What is the time complexity of the quicksort algorithm in the worst case?",
        options: ["O(n)", "O(n log n)", "O(n²)", "O(n log n²)"],
        correctAnswer: 2,
        explanation: "The worst-case scenario for quicksort occurs when the pivot chosen at each step consistently results in the most unbalanced partition possible (e.g., when the array is already sorted). In such cases, quicksort degenerates to a selection sort, resulting in O(n²) time complexity."
      },
      {
        question: "Which data structure allows for constant time insertions and deletions at both ends?",
        options: ["Array", "Linked List", "Deque", "Binary Search Tree"],
        correctAnswer: 2,
        explanation: "A Deque (double-ended queue) is specifically designed to allow constant-time O(1) insertions and deletions at both ends. Arrays have constant-time access but not constant-time insertions at the beginning, while linked lists require traversal to access elements in the middle."
      },
      {
        question: "What is the space complexity of a recursive implementation of binary search?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
        correctAnswer: 1,
        explanation: "The space complexity of a recursive binary search implementation is O(log n) due to the maximum depth of the recursion stack. Each recursive call divides the search space in half, resulting in a logarithmic number of stack frames."
      }
    ]
  },
  dbms: {
    title: "Database Management",
    description: "Test your knowledge of SQL, normalization, and database concepts",
    icon: <Database className="w-6 h-6 text-white" />,
    questions: [
      {
        question: "Which normal form eliminates transitive dependencies?",
        options: ["First Normal Form (1NF)", "Second Normal Form (2NF)", "Third Normal Form (3NF)", "Boyce-Codd Normal Form (BCNF)"],
        correctAnswer: 2,
        explanation: "Third Normal Form (3NF) eliminates transitive dependencies, which occur when a non-prime attribute depends on another non-prime attribute. 3NF requires that a relation is in 2NF and no non-prime attribute is transitively dependent on the primary key."
      },
      {
        question: "Which SQL statement is used to retrieve data from multiple tables?",
        options: ["SELECT", "JOIN", "UNION", "MERGE"],
        correctAnswer: 1,
        explanation: "The JOIN statement in SQL is used to combine rows from two or more tables based on a related column. There are several types of JOINs: INNER JOIN, LEFT JOIN, RIGHT JOIN, and FULL JOIN, each with different behaviors for handling matching records."
      },
      {
        question: "What is a deadlock in database systems?",
        options: ["When a transaction is waiting indefinitely", "When two transactions are waiting for resources held by each other", "When a database crashes", "When a query returns no results"],
        correctAnswer: 1,
        explanation: "A deadlock occurs when two or more transactions are waiting indefinitely for resources (such as locks on tables or rows) that are held by each other. This creates a circular wait condition where none of the transactions can proceed, requiring deadlock detection and resolution mechanisms."
      }
    ]
  },
  os: {
    title: "Operating Systems",
    description: "Test your knowledge of process management, scheduling, and memory management",
    icon: <Cpu className="w-6 h-6 text-white" />,
    questions: [
      {
        question: "Which scheduling algorithm is non-preemptive?",
        options: ["Round Robin", "Shortest Job First", "Priority Scheduling", "All of these can be implemented as either preemptive or non-preemptive"],
        correctAnswer: 1,
        explanation: "Shortest Job First (SJF) in its basic form is non-preemptive, meaning once a process starts execution, it continues until it completes. Round Robin is always preemptive as it allocates a fixed time slice to each process. Priority Scheduling can be implemented as either preemptive or non-preemptive."
      },
      {
        question: "What is thrashing in an operating system?",
        options: ["When a CPU is overloaded", "When a process frequently crashes", "When a system spends more time paging than executing", "When a network is congested"],
        correctAnswer: 2,
        explanation: "Thrashing occurs when a computer's virtual memory subsystem is in a constant state of paging, where memory pages are rapidly being swapped between RAM and disk storage. This happens when the working set of a process doesn't fit in physical memory, severely degrading system performance."
      },
      {
        question: "Which memory allocation strategy suffers most from external fragmentation?",
        options: ["Paging", "Segmentation", "First-Fit", "Buddy System"],
        correctAnswer: 1,
        explanation: "Segmentation suffers the most from external fragmentation because it allocates variable-sized memory blocks based on logical segments of programs. This can lead to many small unusable gaps between allocated segments. Paging, which uses fixed-size blocks, primarily deals with internal fragmentation."
      }
    ]
  }
};

const Topics: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { topicId } = useParams<{ topicId?: string }>();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [correctQuestions, setCorrectQuestions] = useState<number[]>([]);
  const [incorrectQuestions, setIncorrectQuestions] = useState<number[]>([]);

  useEffect(() => {
    // Reset state when topic changes
    setCurrentQuestion(0);
    setQuizCompleted(false);
    setCorrectQuestions([]);
    setIncorrectQuestions([]);
  }, [topicId]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated && topicId) {
      navigate('/login');
    }
  }, [isAuthenticated, topicId, navigate]);

  // If a specific topic is selected, show the quiz
  if (topicId && topicData[topicId as keyof typeof topicData]) {
    const topic = topicData[topicId as keyof typeof topicData];
    const questions = topic.questions;
    
    if (quizCompleted) {
      return (
        <div className="min-h-screen flex flex-col bg-background">
          <Navbar />
          <main className="flex-grow py-12">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-8">
                <button
                  onClick={() => navigate('/topics')}
                  className="text-primary font-medium flex items-center hover:underline"
                >
                  ← Back to Topics
                </button>
                <h1 className="text-3xl font-bold text-foreground mt-4">{topic.title} Quiz</h1>
                <p className="text-muted-foreground mt-2">{topic.description}</p>
              </div>
              
              <QuizFeedback 
                score={correctQuestions.length}
                totalQuestions={questions.length}
                correctQuestions={correctQuestions}
                incorrectQuestions={incorrectQuestions}
                topic={topic.title}
              />
            </div>
          </main>
          <Footer />
        </div>
      );
    }
    
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-grow py-12">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <button
                onClick={() => navigate('/topics')}
                className="text-primary font-medium flex items-center hover:underline"
              >
                ← Back to Topics
              </button>
              <h1 className="text-3xl font-bold text-foreground mt-4">{topic.title} Quiz</h1>
              <p className="text-muted-foreground mt-2">{topic.description}</p>
            </div>
            
            <QuizCard
              question={questions[currentQuestion].question}
              options={questions[currentQuestion].options}
              correctAnswer={questions[currentQuestion].correctAnswer}
              explanation={questions[currentQuestion].explanation}
              onNextQuestion={() => {
                setCurrentQuestion(currentQuestion + 1);
              }}
              onCompleted={(correct, incorrect) => {
                setCorrectQuestions(correct);
                setIncorrectQuestions(incorrect);
                setQuizCompleted(true);
              }}
              isLastQuestion={currentQuestion === questions.length - 1}
              currentQuestion={currentQuestion + 1}
              totalQuestions={questions.length}
              correctQuestions={correctQuestions}
              incorrectQuestions={incorrectQuestions}
            />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Otherwise, show the topics list
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {!isAuthenticated && (
            <div className="mb-10 p-6 rounded-xl bg-darkBlue-900/30 border border-darkBlue-800">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-2">Sign in to track your progress</h2>
                  <p className="text-muted-foreground">Create an account to save your results and get personalized recommendations.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button onClick={() => navigate('/login')} className="bg-primary hover:bg-primary/90">
                    Sign In
                  </Button>
                  <Button onClick={() => navigate('/signup')} variant="outline" className="border-border text-primary">
                    Sign Up
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground">Topics</h1>
            <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
              Choose a topic to test your knowledge and identify areas for improvement
            </p>
          </div>
          
          <div className="mb-8 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-muted-foreground" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-border rounded-md bg-background text-foreground focus:ring-primary focus:border-primary"
                placeholder="Search topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2 border-border text-foreground hover:bg-muted">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              onClick={() => navigate('/topics/dsa')}
              className="bg-gradient-to-br from-darkBlue-700 to-darkBlue-600 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="text-white bg-white/20 p-3 rounded-lg">
                  <Code className="w-6 h-6" />
                </div>
                <ArrowRight className="text-white/70 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-white">Data Structures & Algorithms</h3>
              <p className="mt-2 text-white/80 text-sm">Arrays, Linked Lists, Trees, Graphs, Sorting and Searching Algorithms.</p>
              <div className="mt-4 flex space-x-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/20 text-white">
                  3 Questions
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/20 text-white">
                  5 min
                </span>
              </div>
            </div>

            <div 
              onClick={() => navigate('/topics/dbms')}
              className="bg-gradient-to-br from-blue-700 to-blue-600 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="text-white bg-white/20 p-3 rounded-lg">
                  <Database className="w-6 h-6" />
                </div>
                <ArrowRight className="text-white/70 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-white">Database Management</h3>
              <p className="mt-2 text-white/80 text-sm">SQL, Normalization, Transactions, RDBMS concepts and queries.</p>
              <div className="mt-4 flex space-x-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/20 text-white">
                  3 Questions
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/20 text-white">
                  5 min
                </span>
              </div>
            </div>

            <div 
              onClick={() => navigate('/topics/os')}
              className="bg-gradient-to-br from-darkBlue-800 to-blue-900 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="text-white bg-white/20 p-3 rounded-lg">
                  <Cpu className="w-6 h-6" />
                </div>
                <ArrowRight className="text-white/70 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-white">Operating Systems</h3>
              <p className="mt-2 text-white/80 text-sm">Process Management, Memory Management, File Systems, Scheduling.</p>
              <div className="mt-4 flex space-x-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/20 text-white">
                  3 Questions
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/20 text-white">
                  5 min
                </span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-700 to-amber-600 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="text-white bg-white/20 p-3 rounded-lg">
                  <Brain className="w-6 h-6" />
                </div>
                <ArrowRight className="text-white/70 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-white">Aptitude & Reasoning</h3>
              <p className="mt-2 text-white/80 text-sm">Numerical Ability, Logical Reasoning, Verbal Ability, Data Interpretation.</p>
              <div className="mt-4 flex space-x-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/20 text-white">
                  10 Questions
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/20 text-white">
                  15 min
                </span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-700 to-red-600 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="text-white bg-white/20 p-3 rounded-lg">
                  <BarChart className="w-6 h-6" />
                </div>
                <ArrowRight className="text-white/70 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-white">Computer Networks</h3>
              <p className="mt-2 text-white/80 text-sm">TCP/IP, OSI Model, Routing, Network Security, Protocols.</p>
              <div className="mt-4 flex space-x-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/20 text-white">
                  10 Questions
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/20 text-white">
                  15 min
                </span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-darkBlue-700 to-indigo-600 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="text-white bg-white/20 p-3 rounded-lg">
                  <PieChart className="w-6 h-6" />
                </div>
                <ArrowRight className="text-white/70 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-white">System Design</h3>
              <p className="mt-2 text-white/80 text-sm">Architecture Patterns, Scalability, APIs, Database Design, Caching.</p>
              <div className="mt-4 flex space-x-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/20 text-white">
                  10 Questions
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/20 text-white">
                  15 min
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Topics;

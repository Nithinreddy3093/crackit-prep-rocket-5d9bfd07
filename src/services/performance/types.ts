
export interface UserPerformance {
  userId: string;
  overallScore: number;
  topicScores: Record<string, number>;
  quizzesTaken: number;
  lastQuizDate: string;
  strongTopics: string[];
  weakTopics: string[];
  averageCompletionTime?: number;
  recentSubjects?: string[];
  accuracyPerTopic?: Record<string, number>;
}

export interface PerformanceHistory {
  date: string;
  topic: string;
  score: number;
  completionTime?: number;
}

export interface LearningResource {
  id: string;
  topic: string;
  title: string;
  description: string;
  type: string;
  url: string;
  difficulty: string;
  tags: string[];
}

export interface QuizResult {
  id: string;
  user_id: string;
  topic: string;
  score: number;
  completion_time?: number;
  date: string;
  question_details: {
    questionId: string;
    question: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
  }[];
}

export interface PerformanceStat {
  topic: string;
  progress?: number;
  quizzesTaken?: number;
  averageScore: number;
}

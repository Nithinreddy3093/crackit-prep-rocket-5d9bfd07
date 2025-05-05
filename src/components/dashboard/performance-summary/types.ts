
export interface PerformanceStat {
  topic: string;
  progress: number;
  quizzesTaken: number;
  averageScore: number;
}

export interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: React.ReactNode;
  loading: boolean;
}

export interface StrengthAreaProps {
  areas: string[];
  loading: boolean;
}

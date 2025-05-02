import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from "@/components/ui/use-toast";
import { 
  generateUniqueQuestionsForSession 
} from "@/services/questionService";

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
}

export function useQuestionManagement(userId: string | undefined, topicId: string | undefined) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [seenQuestionIds, setSeenQuestionIds] = useState<string[]>(() => {
    // Load previously seen question IDs from localStorage
    const savedIds = localStorage.getItem('seenQuestionIds');
    return savedIds ? JSON.parse(savedIds) : [];
  });

  // Fetch or generate questions using react-query
  const { 
    isLoading: isQuestionsLoading, 
    error: questionsError 
  } = useQuery({
    queryKey: ['questions', topicId, seenQuestionIds],
    queryFn: () => generateUniqueQuestionsForSession(userId, topicId, seenQuestionIds),
    enabled: !!topicId,
    meta: {
      onSuccess: (data: Question[]) => {
        setQuestions(data);
      },
      onError: (error: any) => {
        toast({
          title: "Error fetching questions",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  });

  // Reset question state
  const resetQuestionState = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setCorrectAnswers(0);
  };

  // Handle answer selection
  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  // Go to next question or complete quiz
  const goToNextQuestion = () => {
    if (!selectedAnswer) {
      toast({
        title: "Please select an answer",
        description: "You must select an answer before proceeding.",
        variant: "destructive",
      });
      return;
    }

    const currentQuestion = questions[currentQuestionIndex];
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setCorrectAnswers(correctAnswers + 1);
    }

    setSelectedAnswer(null); // Reset selected answer

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      return true; // Quiz completed
    }
    
    return false;
  };

  // Update seen question IDs in localStorage
  const updateSeenQuestions = () => {
    if (questions.length > 0) {
      // Add current quiz questions to seen questions
      const newSeenIds = [...seenQuestionIds, ...questions.map(q => q.id)];
      
      // If we have too many IDs, keep only the most recent ones to prevent localStorage from getting too large
      const limitedIds = newSeenIds.slice(-500); // Keep last 500 questions
      
      // Update state and localStorage
      setSeenQuestionIds(limitedIds);
      localStorage.setItem('seenQuestionIds', JSON.stringify(limitedIds));
    }
  };

  return {
    questions,
    currentQuestionIndex,
    selectedAnswer,
    correctAnswers,
    isQuestionsLoading,
    questionsError,
    currentQuestion: questions[currentQuestionIndex],
    seenQuestionIds,
    handleAnswerSelect,
    goToNextQuestion,
    resetQuestionState,
    updateSeenQuestions,
    setQuestions
  };
}

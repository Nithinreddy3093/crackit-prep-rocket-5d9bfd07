
import { useState, useEffect } from 'react';
import { Question, getQuestionsByTopicId } from "@/services/questionService";

export function useQuestionLoading(userId?: string, topicId?: string, seenQuestionIds: string[] = []) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isQuestionsLoading, setIsQuestionsLoading] = useState(true);
  const [questionsError, setQuestionsError] = useState<Error | null>(null);

  // Fetch questions for the topic
  useEffect(() => {
    if (topicId) {
      setIsQuestionsLoading(true);
      setQuestionsError(null);
      
      getQuestionsByTopicId(topicId, seenQuestionIds)
        .then(fetchedQuestions => {
          setQuestions(fetchedQuestions);
          setIsQuestionsLoading(false);
        })
        .catch(error => {
          console.error('Error fetching questions:', error);
          setQuestionsError(error instanceof Error ? error : new Error(String(error)));
          setIsQuestionsLoading(false);
        });
    }
  }, [topicId, seenQuestionIds]);

  return {
    questions,
    setQuestions,
    isQuestionsLoading,
    questionsError
  };
}

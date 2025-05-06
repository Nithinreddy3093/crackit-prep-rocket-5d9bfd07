
import { useState, useEffect, useCallback } from 'react';
import { Question } from "@/services/questionService";

export function useSeenQuestions(userId?: string, topicId?: string) {
  const [seenQuestionIds, setSeenQuestionIds] = useState<string[]>([]);

  // Fetch previously seen questions from localStorage
  useEffect(() => {
    if (userId && topicId) {
      const key = `${userId}_${topicId}_seen_questions`;
      const storedSeenQuestions = localStorage.getItem(key);
      
      if (storedSeenQuestions) {
        try {
          setSeenQuestionIds(JSON.parse(storedSeenQuestions));
        } catch (e) {
          console.error('Error parsing stored seen questions:', e);
          setSeenQuestionIds([]);
        }
      }
    }
  }, [userId, topicId]);

  // Update seen questions in localStorage
  const updateSeenQuestions = useCallback((questions: Question[]) => {
    if (userId && topicId) {
      const newSeenQuestionIds = [
        ...seenQuestionIds,
        ...questions.map(question => question.id)
      ];
      
      // Remove duplicates
      const uniqueSeenQuestionIds = [...new Set(newSeenQuestionIds)];
      
      // Store in localStorage
      const key = `${userId}_${topicId}_seen_questions`;
      localStorage.setItem(key, JSON.stringify(uniqueSeenQuestionIds));
      
      setSeenQuestionIds(uniqueSeenQuestionIds);
      
      // Quiz is complete, remove in-progress data
      localStorage.removeItem('inProgressQuiz');
    }
  }, [userId, topicId, seenQuestionIds]);

  return {
    seenQuestionIds,
    updateSeenQuestions
  };
}

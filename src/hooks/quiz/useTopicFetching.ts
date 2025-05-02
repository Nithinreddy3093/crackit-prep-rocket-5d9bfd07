
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from "@/components/ui/use-toast";
import { getTopicById } from "@/services/topicService";

export interface Topic {
  id: string;
  title: string;
  description?: string;
}

export function useTopicFetching(topicId: string | undefined) {
  const [currentTopic, setCurrentTopic] = useState<Topic | null>(null);

  // Fetch topic details
  const { 
    isLoading: isTopicLoading, 
    error: topicError 
  } = useQuery({
    queryKey: ['topic', topicId],
    queryFn: () => getTopicById(topicId),
    enabled: !!topicId,
    meta: {
      onSuccess: (data: any) => {
        setCurrentTopic(data);
      },
      onError: (error: any) => {
        toast({
          title: "Error fetching topic",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  });

  // Fallback fetch if react-query onSuccess doesn't work
  useEffect(() => {
    if (isTopicLoading === false && !topicError && !currentTopic && topicId) {
      getTopicById(topicId)
        .then(data => {
          setCurrentTopic(data);
        })
        .catch(error => {
          console.error('Error fetching topic:', error);
        });
    }
  }, [isTopicLoading, topicError, topicId, currentTopic]);

  return {
    currentTopic,
    isTopicLoading,
    topicError
  };
}

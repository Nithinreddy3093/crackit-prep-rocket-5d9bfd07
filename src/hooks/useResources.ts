import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Resource {
  id: string;
  topic: string;
  title: string;
  description: string;
  type: 'article' | 'video' | 'course' | 'documentation' | 'code' | 'tutorial';
  url: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
}

export const useResources = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('learning_resources')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Type assertion to ensure proper typing
      const typedData = (data || []).map(item => ({
        ...item,
        type: item.type as Resource['type'],
        difficulty: item.difficulty as Resource['difficulty']
      }));

      setResources(typedData);
    } catch (error) {
      console.error('Error fetching resources:', error);
      toast({
        title: 'Error loading resources',
        description: 'Failed to load learning resources. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return { resources, loading, refetch: fetchResources };
};

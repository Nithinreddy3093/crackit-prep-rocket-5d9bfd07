import React, { useEffect, useState } from 'react';
import { ExternalLink, Bookmark, BookOpen, Video, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { getSuggestedResources } from '@/services/userPerformanceService';

export interface SavedResource {
  id: number;
  title: string;
  type: string;
  topic: string;
  savedOn: string;
  url: string;
}

interface SavedResourcesProps {
  resources?: SavedResource[];
}

const SavedResources: React.FC<SavedResourcesProps> = ({ resources: propResources }) => {
  const { user } = useAuth();
  const [resources, setResources] = useState<SavedResource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        // If prop resources were provided, use them (for backward compatibility)
        if (propResources) {
          setResources(propResources);
        } else if (user) {
          // Otherwise fetch from service
          const suggestedResources = await getSuggestedResources(user.id);
          
          // Convert to SavedResource format
          const formattedResources = suggestedResources.map((resource, index) => ({
            id: index + 1,
            title: resource.title,
            type: resource.type.charAt(0).toUpperCase() + resource.type.slice(1),
            topic: resource.topic || 'General',
            savedOn: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
            url: resource.url
          }));
          
          setResources(formattedResources);
        }
      } catch (error) {
        console.error('Error fetching resources:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [user, propResources]);

  const getResourceIcon = (type: string) => {
    const lowerType = type.toLowerCase();
    if (lowerType.includes('video')) return <Video className="h-4 w-4" />;
    if (lowerType.includes('article')) return <FileText className="h-4 w-4" />;
    if (lowerType.includes('course')) return <BookOpen className="h-4 w-4" />;
    return <BookOpen className="h-4 w-4" />;
  };

  const getResourceColor = (type: string) => {
    const lowerType = type.toLowerCase();
    if (lowerType.includes('video')) return "bg-blue-500/20 text-blue-500";
    if (lowerType.includes('article')) return "bg-purple-500/20 text-purple-500";
    if (lowerType.includes('course')) return "bg-green-500/20 text-green-500";
    return "bg-primary/20 text-primary";
  };

  if (loading) {
    return (
      <div className="min-h-[300px] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
          <p className="text-muted-foreground">Loading your resources...</p>
        </div>
      </div>
    );
  }

  if (resources.length === 0) {
    return (
      <div className="bg-card/50 border border-border rounded-lg p-8 text-center">
        <Bookmark className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
        <h3 className="text-lg font-semibold text-foreground mb-1">No saved resources yet</h3>
        <p className="text-muted-foreground mb-4">Complete more quizzes to get personalized resource recommendations.</p>
        <Button variant="default" onClick={() => window.location.href = '/quiz'}>
          Take a Quiz
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {resources.map((resource) => (
        <div 
          key={resource.id}
          className="flex items-start p-4 bg-card/50 border border-border rounded-lg hover:border-primary/50 hover:bg-card transition-colors"
        >
          <div className={`mr-4 p-2 rounded-lg ${getResourceColor(resource.type)}`}>
            {getResourceIcon(resource.type)}
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-foreground">{resource.title}</h4>
            <div className="flex items-center mt-1 text-xs text-muted-foreground">
              <span className="bg-background/80 px-2 py-0.5 rounded-full">
                {resource.type}
              </span>
              <span className="mx-2">•</span>
              <span>{resource.topic}</span>
              <span className="mx-2">•</span>
              <span>Saved on {resource.savedOn}</span>
            </div>
          </div>
          <Button size="sm" variant="ghost" className="h-8" asChild>
            <a href={resource.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>
      ))}
    </div>
  );
};

export default SavedResources;

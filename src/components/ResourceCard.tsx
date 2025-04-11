
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Video, FileText, Code, ExternalLink, Star } from 'lucide-react';

export interface ResourceProps {
  id: string;
  title: string;
  description: string;
  type: 'article' | 'video' | 'course' | 'documentation' | 'code';
  level: 'beginner' | 'intermediate' | 'advanced';
  topic: string;
  url: string;
  ratings?: number;
  isFavorite?: boolean;
  createdAt: string;
}

const ResourceCard = ({ resource }: { resource: ResourceProps }) => {
  const getIcon = () => {
    switch (resource.type) {
      case 'article':
        return <FileText className="h-5 w-5 text-primary" />;
      case 'video':
        return <Video className="h-5 w-5 text-primary" />;
      case 'course':
        return <BookOpen className="h-5 w-5 text-primary" />;
      case 'documentation':
        return <FileText className="h-5 w-5 text-primary" />;
      case 'code':
        return <Code className="h-5 w-5 text-primary" />;
      default:
        return <FileText className="h-5 w-5 text-primary" />;
    }
  };

  const getLevelColor = () => {
    switch (resource.level) {
      case 'beginner':
        return 'bg-green-500 hover:bg-green-600';
      case 'intermediate':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'advanced':
        return 'bg-purple-500 hover:bg-purple-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  return (
    <Card className="h-full flex flex-col bg-darkBlue-800 border-darkBlue-700 hover:border-darkBlue-600 transition-all duration-200">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex gap-2 items-center">
            {getIcon()}
            <Badge variant="outline" className={`${getLevelColor()} text-white border-none capitalize`}>
              {resource.level}
            </Badge>
          </div>
          {resource.ratings && (
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-400" />
              <span className="ml-1 text-sm text-gray-300">{resource.ratings}</span>
            </div>
          )}
        </div>
        <CardTitle className="text-xl text-white mt-2">{resource.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-gray-300 line-clamp-3">{resource.description}</p>
        <Badge variant="secondary" className="mt-4 bg-darkBlue-700 text-gray-300 hover:bg-darkBlue-600">
          {resource.topic}
        </Badge>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between">
        <p className="text-xs text-gray-400">
          Added {new Date(resource.createdAt).toLocaleDateString()}
        </p>
        <Button variant="outline" className="border-primary text-primary hover:bg-primary/10" asChild>
          <a href={resource.url} target="_blank" rel="noopener noreferrer">
            View <ExternalLink className="ml-1 h-4 w-4" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ResourceCard;

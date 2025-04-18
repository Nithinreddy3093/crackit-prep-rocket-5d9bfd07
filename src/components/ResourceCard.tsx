
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Video, FileText, Code, ExternalLink, Star, Clock, BookMarked, Share2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

export interface ResourceProps {
  id: string;
  title: string;
  description: string;
  type: 'article' | 'video' | 'course' | 'documentation' | 'code';
  level: 'beginner' | 'intermediate' | 'advanced';
  topic: string;
  url: string;
  source?: string;
  author?: string;
  ratings?: number;
  isFavorite?: boolean;
  createdAt: string;
  readTime?: string;
  imageUrl?: string;
}

const ResourceCard = ({ resource }: { resource: ResourceProps }) => {
  const [isFavorite, setIsFavorite] = useState(resource.isFavorite || false);
  const [currentRating, setCurrentRating] = useState(resource.ratings || 0);
  const [isHovered, setIsHovered] = useState(false);

  const getIcon = () => {
    switch (resource.type) {
      case 'article':
        return <FileText className="h-5 w-5 text-primary resource-icon" />;
      case 'video':
        return <Video className="h-5 w-5 text-primary resource-icon" />;
      case 'course':
        return <BookOpen className="h-5 w-5 text-primary resource-icon" />;
      case 'documentation':
        return <BookMarked className="h-5 w-5 text-primary resource-icon" />;
      case 'code':
        return <Code className="h-5 w-5 text-primary resource-icon" />;
      default:
        return <FileText className="h-5 w-5 text-primary resource-icon" />;
    }
  };

  const getLevelColor = () => {
    switch (resource.level) {
      case 'beginner':
        return 'bg-emerald-500 hover:bg-emerald-600';
      case 'intermediate':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'advanced':
        return 'bg-purple-500 hover:bg-purple-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast({
      title: !isFavorite ? "Added to favorites" : "Removed from favorites",
      description: !isFavorite 
        ? `${resource.title} has been added to your favorites.` 
        : `${resource.title} has been removed from your favorites.`,
      variant: "default",
    });
  };

  const handleRate = () => {
    // Simulate rating increment (in a real app, this would call an API)
    const newRating = currentRating + 1;
    setCurrentRating(newRating);
    toast({
      title: "Thanks for your rating!",
      description: `You've successfully rated ${resource.title}.`,
      variant: "default",
    });
  };

  const handleShare = () => {
    // In a real app this would open a sharing dialog
    navigator.clipboard.writeText(resource.url);
    toast({
      title: "Link copied!",
      description: "Resource link has been copied to clipboard.",
      variant: "default",
    });
  };

  return (
    <Card 
      className="h-full flex flex-col resource-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {resource.imageUrl && (
        <div className="w-full h-36 overflow-hidden rounded-t-xl relative">
          <div className="absolute inset-0 bg-gradient-to-t from-darkBlue-900 to-transparent opacity-60 z-10"></div>
          <img 
            src={resource.imageUrl} 
            alt={resource.title} 
            className="w-full h-full object-cover transition-transform duration-500"
            style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
          />
          <div className="absolute top-2 right-2 z-20">
            <Badge variant="outline" className={`${getLevelColor()} text-white border-none capitalize`}>
              {resource.level}
            </Badge>
          </div>
        </div>
      )}
      
      <CardHeader className={`${resource.imageUrl ? 'pb-2 pt-3' : 'pb-2'}`}>
        <div className="flex justify-between items-start">
          <div className="flex gap-2 items-center">
            {!resource.imageUrl && (
              <>
                {getIcon()}
                <Badge variant="outline" className={`${getLevelColor()} text-white border-none capitalize`}>
                  {resource.level}
                </Badge>
              </>
            )}
            {resource.imageUrl && getIcon()}
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleToggleFavorite}
              className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-darkBlue-700 transition-colors"
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              {isFavorite ? (
                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
              ) : (
                <Star className="h-5 w-5 text-gray-400 hover:text-yellow-400" />
              )}
            </button>
            <button 
              onClick={handleShare}
              className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-darkBlue-700 transition-colors"
              aria-label="Share this resource"
            >
              <Share2 className="h-4 w-4 text-gray-400 hover:text-white" />
            </button>
          </div>
        </div>
        <CardTitle className="text-xl text-white mt-2">{resource.title}</CardTitle>
        {resource.author && (
          <p className="text-xs text-blue-300 mt-1">
            By {resource.author}
            {resource.source && ` · ${resource.source}`}
          </p>
        )}
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-gray-300 line-clamp-3">{resource.description}</p>
        <div className="flex flex-wrap gap-2 mt-4">
          <Badge variant="secondary" className="bg-darkBlue-700 text-gray-300 hover:bg-darkBlue-600">
            {resource.topic}
          </Badge>
          {resource.readTime && (
            <Badge variant="outline" className="bg-transparent border-gray-600 text-gray-300 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {resource.readTime}
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between border-t border-darkBlue-700/50 mt-auto">
        <div className="flex items-center">
          <button 
            onClick={handleRate}
            className="flex items-center gap-1 px-2 py-1 rounded-full hover:bg-darkBlue-700 transition-colors"
            aria-label="Rate this resource"
          >
            <Star className="h-4 w-4 text-yellow-400" />
            <span className="text-sm text-gray-300">{currentRating}</span>
          </button>
        </div>
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

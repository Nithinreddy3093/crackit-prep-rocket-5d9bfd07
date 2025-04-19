import React from 'react';
import { ExternalLink, BookOpen, Video, FileText } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ResourceCardProps {
  title: string;
  description: string;
  type: 'video' | 'article' | 'course' | 'tutorial';
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  rating: number;
  topic: string;
  links: { title: string; url: string }[];
}

const ResourceCard: React.FC<ResourceCardProps> = ({
  title,
  description,
  type,
  level,
  rating,
  topic,
  links
}) => {
  // Get icon based on resource type
  const getIcon = () => {
    switch (type) {
      case 'video':
        return <Video className="h-5 w-5" />;
      case 'article':
        return <FileText className="h-5 w-5" />;
      case 'course':
      case 'tutorial':
      default:
        return <BookOpen className="h-5 w-5" />;
    }
  };

  // Get background color based on level
  const getLevelColor = () => {
    switch (level) {
      case 'Beginner':
        return 'bg-green-500/20 text-green-500 dark:bg-green-500/30 dark:text-green-400';
      case 'Intermediate':
        return 'bg-blue-500/20 text-blue-500 dark:bg-blue-500/30 dark:text-blue-400';
      case 'Advanced':
        return 'bg-purple-500/20 text-purple-500 dark:bg-purple-500/30 dark:text-purple-400';
      default:
        return 'bg-primary/20 text-primary';
    }
  };

  return (
    <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-all duration-300 bg-card border-border">
      <CardContent className="flex-grow p-5">
        <div className="flex items-center justify-between mb-3">
          <Badge variant="outline" className={getLevelColor()}>
            {level}
          </Badge>
          <div className="flex items-center">
            <span className="text-yellow-500">★</span>
            <span className="text-sm ml-1 text-muted-foreground">{rating.toFixed(1)}</span>
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        
        <div className="flex items-center text-xs text-muted-foreground mb-4">
          <div className="mr-3 flex items-center">
            <div className="p-1 rounded-full bg-primary/10 mr-1">
              {getIcon()}
            </div>
            <span className="capitalize">{type}</span>
          </div>
          <Badge variant="secondary" className="text-xs font-normal bg-secondary text-foreground">
            {topic}
          </Badge>
        </div>
        
        <div className="space-y-2 mt-4">
          {links.map((link, index) => (
            <a 
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-sm text-primary hover:underline flex items-center group"
            >
              <ExternalLink className="h-3 w-3 mr-2 transition-transform group-hover:translate-x-1" />
              {link.title}
            </a>
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 border-t border-border mt-auto">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full text-primary border-primary/30 hover:bg-primary/10"
          onClick={() => window.open(links[0].url, '_blank')}
        >
          View Resource
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ResourceCard;

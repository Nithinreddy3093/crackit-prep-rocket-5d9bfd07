import React from 'react';
import { motion } from 'framer-motion';
import { Play, ExternalLink, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface AIRecommendedVideo {
  id: string;
  title: string;
  description: string;
  youtubeVideoId: string;
  category: string;
  badge: string;
}

interface AIRecommendedVideoCardProps {
  video: AIRecommendedVideo;
  onPlayVideo: (videoId: string, title: string) => void;
  index?: number;
}

const AIRecommendedVideoCard: React.FC<AIRecommendedVideoCardProps> = ({
  video,
  onPlayVideo,
  index = 0,
}) => {
  const thumbnailUrl = `https://img.youtube.com/vi/${video.youtubeVideoId}/maxresdefault.jpg`;
  const youtubeUrl = `https://www.youtube.com/watch?v=${video.youtubeVideoId}`;

  const handleWatchOnYouTube = () => {
    window.open(youtubeUrl, '_blank');
  };

  const handlePlayInline = () => {
    onPlayVideo(video.youtubeVideoId, video.title);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="h-full"
    >
      <div
        className={cn(
          'group relative h-full rounded-xl overflow-hidden',
          'bg-darkBlue-800/80 backdrop-blur-md',
          'border border-white/10',
          'transition-all duration-300',
          'hover:border-primary/40 hover:shadow-lg hover:shadow-primary/20',
          'hover:scale-[1.02]'
        )}
      >
        {/* Thumbnail Container */}
        <div className="relative aspect-video overflow-hidden">
          <img
            src={thumbnailUrl}
            alt={video.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-darkBlue-900/90 via-transparent to-transparent" />
          
          {/* AI Badge */}
          <div className="absolute top-3 left-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-semibold shadow-lg">
              <Sparkles className="h-3 w-3" />
              {video.badge}
            </div>
          </div>
          
          {/* Play Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={handlePlayInline}
              className="w-16 h-16 rounded-full bg-primary/90 hover:bg-primary flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-110"
            >
              <Play className="h-7 w-7 text-white fill-white ml-1" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Title */}
          <h3 className="text-white font-semibold text-base leading-tight line-clamp-2 min-h-[2.5rem]">
            {video.title}
          </h3>
          
          {/* Category/Descriptor */}
          <p className="text-white/60 text-sm flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary" />
            {video.category}
          </p>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-1">
            <Button
              onClick={handleWatchOnYouTube}
              variant="outline"
              size="sm"
              className="flex-1 border-white/20 text-white hover:bg-white/10 hover:border-white/40"
            >
              <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
              Watch
            </Button>
            <Button
              onClick={handlePlayInline}
              size="sm"
              className="flex-1 bg-primary hover:bg-primary/90 text-white"
            >
              <Play className="h-3.5 w-3.5 mr-1.5" />
              Play
            </Button>
          </div>
        </div>

        {/* Subtle Glow Effect */}
        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />
        </div>
      </div>
    </motion.div>
  );
};

export default AIRecommendedVideoCard;

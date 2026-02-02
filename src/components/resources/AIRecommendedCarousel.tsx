import React, { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Flame, Bot } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import AIRecommendedVideoCard, { type AIRecommendedVideo } from './AIRecommendedVideoCard';
import { cn } from '@/lib/utils';

// Default recommended videos data
const defaultRecommendedVideos: AIRecommendedVideo[] = [
  {
    id: 'oops-java',
    title: 'OOPS in Java – Zero to Hero (One Shot)',
    description: 'Complete object-oriented programming concepts in Java',
    youtubeVideoId: 'dT-4mt3lxJo',
    category: 'Interview Essential • One Shot',
    badge: 'AI Recommended',
  },
  {
    id: 'dbms-playlist',
    title: 'DBMS Full Playlist – Syllabus Discussion',
    description: 'Complete DBMS concepts for GATE and UGC NET preparation',
    youtubeVideoId: 'kBdlM6hNDAE',
    category: 'GATE & UGC NET • Complete Course',
    badge: 'AI Recommended',
  },
  {
    id: 'beginner-guide',
    title: 'Beginner / How to Start Learning (Reality Check)',
    description: 'Career guidance and learning path for beginners',
    youtubeVideoId: '0bHoB32fuj0',
    category: 'Career Guidance • Must Watch',
    badge: 'AI Recommended',
  },
];

interface AIRecommendedCarouselProps {
  videos?: AIRecommendedVideo[];
  onPlayVideo: (videoId: string, title: string) => void;
}

const AIRecommendedCarousel: React.FC<AIRecommendedCarouselProps> = ({
  videos = defaultRecommendedVideos,
  onPlayVideo,
}) => {
  const [api, setApi] = useState<CarouselApi>();
  const [isPaused, setIsPaused] = useState(false);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  // Update scroll button states
  const onSelect = useCallback(() => {
    if (!api) return;
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
  }, [api]);

  useEffect(() => {
    if (!api) return;
    onSelect();
    api.on('select', onSelect);
    api.on('reInit', onSelect);
    return () => {
      api.off('select', onSelect);
    };
  }, [api, onSelect]);

  // Auto-scroll with pause on hover
  useEffect(() => {
    if (!api || isPaused) return;

    const interval = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [api, isPaused]);

  const scrollPrev = useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  const scrollNext = useCallback(() => {
    api?.scrollNext();
  }, [api]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full py-8"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* AI Context Line */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center justify-center gap-2 mb-4"
      >
        <Bot className="h-4 w-4 text-primary" />
        <span className="text-sm text-white/60">
          Recommended by Crackit AI based on interview & exam trends
        </span>
      </motion.div>

      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="text-center md:text-left">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl md:text-3xl font-bold text-white flex items-center justify-center md:justify-start gap-2"
          >
            <Flame className="h-7 w-7 text-orange-500" />
            Top AI-Recommended Resources
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-white/60 mt-1"
          >
            Handpicked videos to build strong fundamentals before practice
          </motion.p>
        </div>

        {/* Navigation Arrows - Desktop */}
        <div className="hidden md:flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            className={cn(
              'h-10 w-10 rounded-full border-white/20 bg-white/5',
              'hover:bg-white/10 hover:border-white/40',
              'disabled:opacity-30 disabled:cursor-not-allowed',
              'text-white'
            )}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={scrollNext}
            disabled={!canScrollNext}
            className={cn(
              'h-10 w-10 rounded-full border-white/20 bg-white/5',
              'hover:bg-white/10 hover:border-white/40',
              'disabled:opacity-30 disabled:cursor-not-allowed',
              'text-white'
            )}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Carousel */}
      <Carousel
        opts={{
          align: 'start',
          loop: true,
        }}
        setApi={setApi}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {videos.map((video, index) => (
            <CarouselItem
              key={video.id}
              className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
            >
              <AIRecommendedVideoCard
                video={video}
                onPlayVideo={onPlayVideo}
                index={index}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Mobile Swipe Hint */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center text-white/40 text-xs mt-4 md:hidden"
      >
        Swipe to explore more →
      </motion.p>
    </motion.section>
  );
};

export default AIRecommendedCarousel;

import React, { useEffect, useRef } from 'react';
import { X, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: string;
  title: string;
}

const VideoModal: React.FC<VideoModalProps> = ({
  isOpen,
  onClose,
  videoId,
  title,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Stop video when modal closes
  useEffect(() => {
    if (!isOpen && iframeRef.current) {
      iframeRef.current.src = '';
    }
  }, [isOpen]);

  const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;

  const handleOpenYouTube = () => {
    window.open(youtubeUrl, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-4xl p-0 bg-[#0f172a] border-white/10 overflow-hidden">
        <DialogHeader className="p-4 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-white text-lg font-semibold">
              {title}
            </DialogTitle>
          </div>
        </DialogHeader>
        
        {/* Video Container */}
        <div className="relative w-full aspect-video bg-black">
          {isOpen && (
            <iframe
              ref={iframeRef}
              src={embedUrl}
              title={title}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </div>

        {/* Footer */}
        <div className="p-4 flex justify-between items-center border-t border-white/10">
          <Button
            onClick={handleOpenYouTube}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Watch Full Video on YouTube
          </Button>
          <Button
            onClick={onClose}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
            <X className="h-4 w-4 mr-2" />
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoModal;

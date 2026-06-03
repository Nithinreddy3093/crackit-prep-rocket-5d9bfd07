import React from 'react';
import { Link } from 'react-router-dom';
import logo from '@/assets/crackit-logo.png';
import { cn } from '@/lib/utils';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showWordmark?: boolean;
  asLink?: boolean;
  className?: string;
}

const sizeMap = {
  sm: { box: 'w-7 h-7', text: 'text-base' },
  md: { box: 'w-9 h-9', text: 'text-xl' },
  lg: { box: 'w-12 h-12', text: 'text-2xl' },
};

const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showWordmark = true,
  asLink = true,
  className,
}) => {
  const s = sizeMap[size];
  const content = (
    <span className={cn('inline-flex items-center group', className)}>
      <span
        className={cn(
          'relative flex items-center justify-center rounded-xl overflow-hidden shadow-glow',
          s.box
        )}
      >
        <img
          src={logo}
          alt="CrackIt logo"
          className="w-full h-full object-contain drop-shadow-[0_0_10px_hsl(var(--primary)/0.6)] transition-transform group-hover:scale-105"
          width={64}
          height={64}
          loading="eager"
          decoding="async"
        />
      </span>
      {showWordmark && (
        <span
          className={cn(
            'ml-2.5 font-bold font-display tracking-tight text-foreground',
            s.text
          )}
        >
          Crack<span className="gradient-text">It</span>
        </span>
      )}
    </span>
  );

  return asLink ? (
    <Link to="/" className="flex-shrink-0 flex items-center" aria-label="CrackIt home">
      {content}
    </Link>
  ) : (
    content
  );
};

export default Logo;

import React, { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { useWindowSize } from '@/hooks/useWindowSize';

interface ConfettiEffectProps {
  active: boolean;
  duration?: number;
  onComplete?: () => void;
}

const ConfettiEffect: React.FC<ConfettiEffectProps> = ({ 
  active, 
  duration = 5000,
  onComplete 
}) => {
  const { width, height } = useWindowSize();
  const [isActive, setIsActive] = useState(active);

  useEffect(() => {
    if (active) {
      setIsActive(true);
      const timer = setTimeout(() => {
        setIsActive(false);
        onComplete?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [active, duration, onComplete]);

  if (!isActive) return null;

  return (
    <Confetti
      width={width}
      height={height}
      recycle={false}
      numberOfPieces={500}
      gravity={0.3}
      colors={[
        'hsl(var(--primary))',
        'hsl(var(--secondary))',
        '#FFD700',
        '#FFA500',
        '#FF69B4',
        '#00CED1'
      ]}
    />
  );
};

export default ConfettiEffect;

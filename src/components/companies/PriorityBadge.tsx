import React from 'react';
import { Flame, AlertTriangle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PriorityBadgeProps {
  priority: 'high' | 'medium' | 'low';
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const priorityConfig = {
  high: {
    label: 'High Priority',
    icon: Flame,
    className: 'bg-red-500/20 text-red-400 border-red-500/30',
  },
  medium: {
    label: 'Medium Priority',
    icon: AlertTriangle,
    className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  },
  low: {
    label: 'Low Priority',
    icon: CheckCircle,
    className: 'bg-green-500/20 text-green-400 border-green-500/30',
  },
};

const sizeConfig = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
};

const iconSizeConfig = {
  sm: 'h-3 w-3',
  md: 'h-3.5 w-3.5',
  lg: 'h-4 w-4',
};

const PriorityBadge: React.FC<PriorityBadgeProps> = ({ 
  priority, 
  showLabel = true,
  size = 'md' 
}) => {
  const config = priorityConfig[priority];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border font-medium',
        config.className,
        sizeConfig[size]
      )}
    >
      <Icon className={iconSizeConfig[size]} />
      {showLabel && <span>{config.label}</span>}
    </span>
  );
};

export default PriorityBadge;

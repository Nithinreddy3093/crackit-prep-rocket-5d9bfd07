
import React from 'react';
import { 
  Book, 
  Database, 
  Cpu, 
  Brain, 
  BarChart, 
  PieChart, 
  Globe,
  Layers,
  Code,
  Network
} from 'lucide-react';

export const getTopicIcon = (iconName: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    'Book': <Book className="w-6 h-6" />,
    'Database': <Database className="w-6 h-6" />,
    'Cpu': <Cpu className="w-6 h-6" />,
    'Brain': <Brain className="w-6 h-6" />,
    'BarChart': <BarChart className="w-6 h-6" />,
    'PieChart': <PieChart className="w-6 h-6" />,
    'Globe': <Globe className="w-6 h-6" />,
    'Layers': <Layers className="w-6 h-6" />,
    'Code': <Code className="w-6 h-6" />,
    'Network': <Network className="w-6 h-6" />
  };

  return iconMap[iconName] || <Book className="w-6 h-6" />;
};

export const getDifficultyColor = (difficulty: string): string => {
  switch (difficulty.toLowerCase()) {
    case 'beginner':
      return 'text-green-500';
    case 'intermediate':
      return 'text-yellow-500';
    case 'advanced':
      return 'text-red-500';
    default:
      return 'text-gray-500';
  }
};

export const getDifficultyBadgeColor = (difficulty: string): string => {
  switch (difficulty.toLowerCase()) {
    case 'beginner':
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'intermediate':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'advanced':
      return 'bg-red-500/20 text-red-400 border-red-500/30';
    default:
      return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }
};

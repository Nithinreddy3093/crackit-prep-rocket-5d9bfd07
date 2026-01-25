import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Zap, History, FileText, Brain } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface QuickActionProps {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
  onClick: () => void;
}

const QuickAction: React.FC<QuickActionProps> = ({ icon: Icon, title, description, color, onClick }) => (
  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
    <Card
      onClick={onClick}
      className="cursor-pointer p-4 bg-card/80 backdrop-blur-sm border-border hover:border-primary/50 transition-all group"
    >
      <div className="flex items-center gap-3">
        <div className={`p-2.5 rounded-xl ${color} shrink-0`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div className="min-w-0">
          <h4 className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors">
            {title}
          </h4>
          <p className="text-xs text-muted-foreground truncate">{description}</p>
        </div>
      </div>
    </Card>
  </motion.div>
);

const UPSCQuickActions: React.FC = () => {
  const navigate = useNavigate();

  const actions = [
    {
      icon: Zap,
      title: 'Quick Practice',
      description: '5-10 questions, any subject',
      color: 'bg-gradient-to-br from-orange-500 to-amber-500',
      onClick: () => navigate('/quiz/upsc-polity?mode=quick'),
    },
    {
      icon: History,
      title: 'PYQ Practice',
      description: 'Previous year questions',
      color: 'bg-gradient-to-br from-blue-500 to-indigo-500',
      onClick: () => navigate('/quiz/upsc-history'),
    },
    {
      icon: FileText,
      title: 'Full Mock',
      description: '100 questions, 2 hours',
      color: 'bg-gradient-to-br from-green-500 to-emerald-500',
      onClick: () => navigate('/quiz/upsc-polity?mode=mock'),
    },
    {
      icon: Brain,
      title: 'Weak Areas',
      description: 'AI-curated practice',
      color: 'bg-gradient-to-br from-purple-500 to-violet-500',
      onClick: () => navigate('/quiz/upsc-csat'),
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {actions.map((action, index) => (
        <motion.div
          key={action.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <QuickAction {...action} />
        </motion.div>
      ))}
    </div>
  );
};

export default UPSCQuickActions;
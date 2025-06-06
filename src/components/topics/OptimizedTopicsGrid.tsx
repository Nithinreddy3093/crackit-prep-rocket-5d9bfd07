
import React, { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { getTopicIcon } from '@/utils/topicUtils';
import TopicCard from '@/components/topics/TopicCard';
import { Topic } from '@/services/topicService';

interface OptimizedTopicsGridProps {
  topics: Topic[];
  onTopicClick: (topicId: string) => void;
  searchQuery?: string;
}

const OptimizedTopicsGrid: React.FC<OptimizedTopicsGridProps> = ({ 
  topics, 
  onTopicClick,
  searchQuery = ''
}) => {
  const highlightedTopics = useMemo(() => {
    if (!searchQuery.trim()) return topics;
    
    return topics.map(topic => ({
      ...topic,
      isHighlighted: topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    topic.description.toLowerCase().includes(searchQuery.toLowerCase())
    }));
  }, [topics, searchQuery]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    }
  };

  if (topics.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <div className="bg-muted/20 rounded-lg p-8">
          <h3 className="text-lg font-medium text-foreground mb-2">No topics found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {highlightedTopics.map((topic, index) => (
        <TopicCard
          key={topic.id}
          title={topic.title}
          icon={getTopicIcon(topic.icon)}
          description={topic.description}
          bgColor={`bg-gradient-to-br ${topic.color || 'from-darkBlue-700 to-darkBlue-600'}`}
          to={`/quiz/${topic.id}`}
          questionCount={topic.questionsCount || 10}
          timeEstimate={`${Math.round((topic.questionsCount || 10) * 1.5)} min`}
          completed={0}
          onClick={() => onTopicClick(topic.id)}
          index={index}
        />
      ))}
    </motion.div>
  );
};

export default memo(OptimizedTopicsGrid);

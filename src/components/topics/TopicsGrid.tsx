
import React from 'react';
import { motion } from 'framer-motion';
import { Book } from 'lucide-react';
import TopicCard from '@/components/TopicCard';
import { Topic } from '@/services/topicService';

interface TopicsGridProps {
  topics: Topic[];
  onTopicClick: (topicId: string) => void;
}

const TopicsGrid: React.FC<TopicsGridProps> = ({ topics, onTopicClick }) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {topics.map((topic) => (
        <motion.div key={topic.id} variants={item}>
          <TopicCard
            title={topic.title}
            icon={<Book className="w-6 h-6" />}
            description={topic.description}
            bgColor={`bg-gradient-to-br ${topic.color || 'from-darkBlue-700 to-darkBlue-600'}`}
            to="#"
            questionCount={topic.questionsCount || 10}
            timeEstimate={`${Math.round((topic.questionsCount || 10) * 1.5)} min`}
            completed={0}
            onClick={() => onTopicClick(topic.id)}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default TopicsGrid;

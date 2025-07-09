
import React, { memo, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import TopicCard from '@/components/topics/TopicCard';
import { getTopicIcon } from '@/utils/topicUtils';
import { getAllTopics, Topic } from '@/services/topicService';

const TopicsSection = () => {
  const navigate = useNavigate();
  const [popularTopics, setPopularTopics] = useState<Topic[]>([]);

  useEffect(() => {
    const fetchPopularTopics = async () => {
      try {
        const allTopics = await getAllTopics();
        // Show first 6 topics as popular
        setPopularTopics(allTopics.slice(0, 6));
      } catch (error) {
        console.error('Error fetching topics:', error);
      }
    };

    fetchPopularTopics();
  }, []);

  const handleTopicClick = (topicId: string) => {
    console.log('Homepage topic clicked:', topicId);
    navigate(`/quiz/${topicId}`);
  };

  return (
    <section className="py-12 sm:py-16 bg-muted/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            Test Yourself in Popular Topics
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            Choose from various technical and non-technical subjects to assess your knowledge and identify areas for improvement.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularTopics.map((topic, index) => (
            <TopicCard
              key={topic.id}
              title={topic.title}
              icon={getTopicIcon(topic.icon)}
              description={topic.description}
              bgColor={`bg-gradient-to-br ${topic.color || 'from-darkBlue-700 to-darkBlue-600'}`}
              to={`/quiz/${topic.id}`}
              questionCount={topic.questionsCount}
              timeEstimate={`${Math.round((topic.questionsCount || 10) * 1.5)} min`}
              onClick={() => handleTopicClick(topic.id)}
              index={index}
            />
          ))}
        </div>
        
        <div className="mt-10 text-center">
          <Link
            to="/topics"
            className="inline-flex items-center text-primary hover:text-primary/90 font-medium transition-colors group"
          >
            View all topics
            <ArrowRight className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default memo(TopicsSection);

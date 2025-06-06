
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getAllTopics, Topic } from '@/services/topicService';
import { useAuth } from '@/contexts/AuthContext';
import EnhancedSearchFilterBar from '@/components/topics/EnhancedSearchFilterBar';
import OptimizedTopicsGrid from '@/components/topics/OptimizedTopicsGrid';
import EmptyState from '@/components/topics/EmptyState';
import LoadingSkeleton from '@/components/topics/LoadingSkeleton';
import AuthPrompt from '@/components/topics/AuthPrompt';

const Topics: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [allTopics, setAllTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [difficultyFilter, setDifficultyFilter] = useState('all');

  // Memoized filtered topics for better performance
  const filteredTopics = useMemo(() => {
    let filtered = allTopics;
    
    // Apply search filter
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(topic => 
        topic.title.toLowerCase().includes(query) || 
        topic.description.toLowerCase().includes(query)
      );
    }
    
    // Apply difficulty filter
    if (difficultyFilter !== 'all') {
      filtered = filtered.filter(topic => 
        topic.difficulty === difficultyFilter
      );
    }
    
    return filtered;
  }, [searchQuery, difficultyFilter, allTopics]);

  useEffect(() => {
    const fetchTopics = async () => {
      setLoading(true);
      try {
        const topics = await getAllTopics();
        setAllTopics(topics);
      } catch (error) {
        console.error('Error fetching topics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, []);

  const handleTopicClick = (topicId: string) => {
    navigate(`/quiz/${topicId}`);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setDifficultyFilter('all');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-darkBlue-900 via-darkBlue-800 to-darkBlue-700">
      <Navbar />
      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {!isAuthenticated && <AuthPrompt />}

          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">Quiz Topics</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Choose a topic to start your quiz and test your knowledge across various subjects
            </p>
          </div>
          
          <EnhancedSearchFilterBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            difficultyFilter={difficultyFilter}
            setDifficultyFilter={setDifficultyFilter}
            totalTopics={allTopics.length}
            filteredCount={filteredTopics.length}
          />
          
          {loading ? (
            <LoadingSkeleton />
          ) : filteredTopics.length > 0 ? (
            <OptimizedTopicsGrid 
              topics={filteredTopics} 
              onTopicClick={handleTopicClick}
              searchQuery={searchQuery}
            />
          ) : (
            <EmptyState onClearFilters={clearFilters} />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Topics;

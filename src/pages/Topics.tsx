
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getAllTopics, Topic } from '@/services/topicService';
import { useAuth } from '@/contexts/AuthContext';
import SearchFilterBar from '@/components/topics/SearchFilterBar';
import TopicsGrid from '@/components/topics/TopicsGrid';
import EmptyState from '@/components/topics/EmptyState';
import LoadingSkeleton from '@/components/topics/LoadingSkeleton';
import AuthPrompt from '@/components/topics/AuthPrompt';

const Topics: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTopics, setFilteredTopics] = useState<Topic[]>([]);
  const [allTopics, setAllTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [difficultyFilter, setDifficultyFilter] = useState('all');

  useEffect(() => {
    const fetchTopics = async () => {
      setLoading(true);
      try {
        const topics = await getAllTopics();
        setAllTopics(topics);
        setFilteredTopics(topics);
      } catch (error) {
        console.error('Error fetching topics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '' && difficultyFilter === 'all') {
      setFilteredTopics(allTopics);
      return;
    }

    let filtered = allTopics;
    
    // Apply search filter
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(topic => 
        topic.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        topic.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply difficulty filter
    if (difficultyFilter !== 'all') {
      filtered = filtered.filter(topic => 
        topic.difficulty === difficultyFilter
      );
    }
    
    setFilteredTopics(filtered);
  }, [searchQuery, difficultyFilter, allTopics]);

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
            <h1 className="text-4xl font-bold text-foreground">Quiz Topics</h1>
            <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
              Choose a topic to start your quiz and test your knowledge
            </p>
          </div>
          
          <SearchFilterBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            difficultyFilter={difficultyFilter}
            setDifficultyFilter={setDifficultyFilter}
          />
          
          {loading ? (
            <LoadingSkeleton />
          ) : filteredTopics.length > 0 ? (
            <TopicsGrid topics={filteredTopics} onTopicClick={handleTopicClick} />
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

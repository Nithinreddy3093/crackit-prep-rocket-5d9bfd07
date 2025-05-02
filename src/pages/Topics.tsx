
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getAllTopics, Topic } from '@/services/topicService';
import { motion } from 'framer-motion';
import { Search, Filter, Books, BookX, ListFilter } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import TopicCard from '@/components/TopicCard';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Topics: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-darkBlue-900 via-darkBlue-800 to-darkBlue-700">
      <Navbar />
      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {!isAuthenticated && (
            <div className="mb-10 p-6 rounded-xl bg-darkBlue-900/30 border border-darkBlue-800">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-2">Sign in to track your progress</h2>
                  <p className="text-muted-foreground">Create an account to save your results and get personalized recommendations.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button onClick={() => navigate('/login')} className="bg-primary hover:bg-primary/90">
                    Sign In
                  </Button>
                  <Button onClick={() => navigate('/signup')} variant="outline" className="border-border text-primary">
                    Sign Up
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground">Quiz Topics</h1>
            <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
              Choose a topic to start your quiz and test your knowledge
            </p>
          </div>
          
          {/* Search and Filter Section */}
          <div className="mb-8 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-muted-foreground" />
              </div>
              <Input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-border rounded-md bg-background text-foreground focus:ring-primary focus:border-primary"
                placeholder="Search topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="w-full sm:w-48">
              <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter by difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Difficulty</SelectLabel>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((_, index) => (
                <div key={index} className="h-64 rounded-xl bg-darkBlue-800/50 animate-pulse"></div>
              ))}
            </div>
          ) : filteredTopics.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {filteredTopics.map((topic) => (
                <motion.div key={topic.id} variants={item}>
                  <TopicCard
                    title={topic.title}
                    icon={<Books className="w-6 h-6" />}
                    description={topic.description}
                    bgColor={`bg-gradient-to-br ${topic.color || 'from-darkBlue-700 to-darkBlue-600'}`}
                    to="#"
                    questionCount={topic.questionsCount || 10}
                    timeEstimate={`${Math.round((topic.questionsCount || 10) * 1.5)} min`}
                    completed={0}
                    onClick={() => handleTopicClick(topic.id)}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="py-16 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-darkBlue-800 mb-4">
                <BookX className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-medium text-foreground mb-2">No topics found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search or filter to find what you're looking for.
              </p>
              <Button onClick={() => {
                setSearchQuery('');
                setDifficultyFilter('all');
              }} variant="outline" className="border-primary text-primary">
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Topics;

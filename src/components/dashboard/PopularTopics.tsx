
import React from 'react';
import { ArrowRight, Code, Database, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TopicCard from '@/components/TopicCard';
import { useNavigate } from 'react-router-dom';

const PopularTopics = () => {
  const navigate = useNavigate();
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Popular Topics</h2>
        <Button 
          onClick={() => navigate('/topics')}
          variant="link" 
          className="text-primary hover:text-primary/90 flex items-center"
        >
          View All
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <TopicCard
          title="Data Structures & Algorithms"
          icon={<Code className="w-6 h-6" />}
          description="Arrays, Linked Lists, Trees, Graphs, Sorting and Searching Algorithms."
          bgColor="bg-gradient-to-br from-darkBlue-700 to-darkBlue-600"
          to="/topics/dsa"
        />
        <TopicCard
          title="Database Management"
          icon={<Database className="w-6 h-6" />}
          description="SQL, Normalization, Transactions, RDBMS concepts and queries."
          bgColor="bg-gradient-to-br from-blue-700 to-blue-600"
          to="/topics/dbms"
        />
        <TopicCard
          title="Operating Systems"
          icon={<Cpu className="w-6 h-6" />}
          description="Process Management, Memory Management, File Systems, Scheduling."
          bgColor="bg-gradient-to-br from-darkBlue-800 to-blue-900"
          to="/topics/os"
        />
      </div>
    </div>
  );
};

export default PopularTopics;

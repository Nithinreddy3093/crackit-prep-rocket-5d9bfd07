
import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import TopicCard from '@/components/topics/TopicCard';
import { getTopicIcon } from '@/utils/topicUtils';

// Define topic data outside component to prevent recreation on each render
const topicData = [
  {
    id: "dsa",
    title: "Data Structures & Algorithms",
    icon: "Code",
    description: "Arrays, Linked Lists, Trees, Graphs, Sorting and Searching Algorithms.",
    bgColor: "bg-gradient-to-br from-darkBlue-700 to-darkBlue-600"
  },
  {
    id: "dbms",
    title: "Database Management",
    icon: "Database",
    description: "SQL, Normalization, Transactions, RDBMS concepts and queries.",
    bgColor: "bg-gradient-to-br from-blue-700 to-blue-600"
  },
  {
    id: "os",
    title: "Operating Systems",
    icon: "Cpu",
    description: "Process Management, Memory Management, File Systems, Scheduling.",
    bgColor: "bg-gradient-to-br from-darkBlue-800 to-blue-900"
  },
  {
    id: "aptitude",
    title: "Aptitude & Reasoning",
    icon: "Brain",
    description: "Numerical Ability, Logical Reasoning, Verbal Ability, Data Interpretation.",
    bgColor: "bg-gradient-to-br from-amber-700 to-amber-600"
  },
  {
    id: "networks",
    title: "Computer Networks",
    icon: "Network",
    description: "TCP/IP, OSI Model, Routing, Network Security, Protocols.",
    bgColor: "bg-gradient-to-br from-red-700 to-red-600"
  },
  {
    id: "system-design",
    title: "System Design",
    icon: "PieChart",
    description: "Architecture Patterns, Scalability, APIs, Database Design, Caching.",
    bgColor: "bg-gradient-to-br from-darkBlue-700 to-indigo-600"
  }
];

const TopicsSection = () => {
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
          {topicData.map((topic, index) => (
            <TopicCard
              key={topic.id}
              title={topic.title}
              icon={getTopicIcon(topic.icon)}
              description={topic.description}
              bgColor={topic.bgColor}
              to={`/topics/${topic.id}`}
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

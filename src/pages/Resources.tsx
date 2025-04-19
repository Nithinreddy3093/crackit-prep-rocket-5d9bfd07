
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ResourceCard from '@/components/resources/ResourceCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, Filter, Book, BookOpen } from 'lucide-react';

// Sample resource data
const resources = [
  {
    id: 1,
    title: 'Introduction to Data Structures & Algorithms',
    description: 'A comprehensive guide to understanding the fundamentals of data structures and algorithms for beginners.',
    type: 'course' as const,
    level: 'Advanced' as const,
    rating: 4.5,
    topic: 'DSA',
    links: [
      { title: 'GeeksforGeeks DSA Basics', url: 'https://www.geeksforgeeks.org/data-structures/' },
      { title: 'FreeCodeCamp YouTube - DSA for Beginners', url: 'https://www.youtube.com/watch?v=8hly31xKli0' },
      { title: 'CS50 DSA Lecture', url: 'https://cs50.harvard.edu/x/2023/weeks/5/' }
    ]
  },
  {
    id: 2,
    title: 'Advanced Database Management Concepts',
    description: 'Deep dive into advanced DBMS including normalization, indexing, and optimization.',
    type: 'article' as const,
    level: 'Intermediate' as const,
    rating: 4.8,
    topic: 'DBMS',
    links: [
      { title: 'Stanford DB Course', url: 'https://cs.stanford.edu/people/widom/cs346/' },
      { title: 'GFG Advanced DBMS', url: 'https://www.geeksforgeeks.org/dbms/' },
      { title: 'DBMS by Neso Academy', url: 'https://www.youtube.com/playlist?list=PLBlnK6fEyqRi_CUQ-FXxgzKQ1dwr_ZJWZ' }
    ]
  },
  {
    id: 3,
    title: 'Operating Systems: Memory Management',
    description: 'Understand memory allocation, paging, and virtual memory in OS.',
    type: 'video' as const,
    level: 'Intermediate' as const,
    rating: 4.2,
    topic: 'OS',
    links: [
      { title: 'Operating Systems by GFG', url: 'https://www.geeksforgeeks.org/operating-systems/' },
      { title: 'Memory Management by Neso Academy', url: 'https://www.youtube.com/watch?v=2DGUKKs9d4A' },
      { title: 'CS50 - OS Fundamentals', url: 'https://cs50.harvard.edu/x/2023/weeks/2/' }
    ]
  },
  {
    id: 4,
    title: 'Leetcode Problem Solving Patterns',
    description: 'Master patterns to solve algorithm problems efficiently.',
    type: 'tutorial' as const,
    level: 'Advanced' as const,
    rating: 4.9,
    topic: 'DSA',
    links: [
      { title: 'Leetcode Patterns Sheet', url: 'https://seanprashad.com/leetcode-patterns/' },
      { title: 'NeetCode Playlist', url: 'https://www.youtube.com/c/NeetCode' },
      { title: 'Blind 75 Leetcode', url: 'https://leetcode.com/discuss/general-discussion/460599/blind-75-leetcode-questions' }
    ]
  },
  {
    id: 5,
    title: 'Network Protocols and Security',
    description: 'Learn key networking protocols and basic cyber security implementations.',
    type: 'course' as const,
    level: 'Beginner' as const,
    rating: 4.7,
    topic: 'Networking',
    links: [
      { title: 'Computer Networking by Stanford', url: 'https://cs144.github.io/' },
      { title: 'Network Security GFG', url: 'https://www.geeksforgeeks.org/network-security/' },
      { title: 'Cisco Packet Tracer Tutorials', url: 'https://www.netacad.com/courses/packet-tracer' }
    ]
  },
  {
    id: 6,
    title: 'Git & GitHub for Beginners',
    description: 'Understand Git version control and manage projects efficiently.',
    type: 'video' as const,
    level: 'Intermediate' as const,
    rating: 4.6,
    topic: 'Tools',
    links: [
      { title: 'Git & GitHub Full Course – FreeCodeCamp', url: 'https://www.youtube.com/watch?v=RGOj5yH7evk' },
      { title: 'Git Handbook', url: 'https://guides.github.com/introduction/git-handbook/' },
      { title: 'GitHub Docs', url: 'https://docs.github.com/en' }
    ]
  },
  {
    id: 7,
    title: 'JavaScript Design Patterns',
    description: 'Write scalable code using proven JS patterns.',
    type: 'article' as const,
    level: 'Beginner' as const,
    rating: 4.3,
    topic: 'Web Development',
    links: [
      { title: 'JavaScript Design Patterns Explained', url: 'https://www.patterns.dev/posts' },
      { title: 'JS Design Patterns - FreeCodeCamp', url: 'https://www.freecodecamp.org/news/javascript-design-patterns-explained/' },
      { title: 'MDN: JavaScript Patterns', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide' }
    ]
  },
  {
    id: 8,
    title: 'Introduction to Machine Learning',
    description: 'Beginner-friendly machine learning algorithms and real-life applications.',
    type: 'course' as const,
    level: 'Beginner' as const,
    rating: 4.8,
    topic: 'ML',
    links: [
      { title: 'Andrew Ng ML Course - Coursera', url: 'https://www.coursera.org/learn/machine-learning' },
      { title: 'ML by Krish Naik YouTube', url: 'https://www.youtube.com/user/krishnaik06' },
      { title: 'Google Machine Learning Crash Course', url: 'https://developers.google.com/machine-learning/crash-course' }
    ]
  }
];

const topicFilters = [
  'All', 'DSA', 'DBMS', 'OS', 'Networking', 'Web Development', 'ML', 'Tools'
];

const levelsFilters = [
  'All', 'Beginner', 'Intermediate', 'Advanced'
];

const typesFilters = [
  'All', 'Article', 'Video', 'Course', 'Tutorial'
];

const Resources = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [selectedType, setSelectedType] = useState('All');

  // Filter resources based on search and filters
  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTopic = selectedTopic === 'All' || resource.topic === selectedTopic;
    const matchesLevel = selectedLevel === 'All' || resource.level === selectedLevel;
    const matchesType = selectedType === 'All' || resource.type === selectedType.toLowerCase();
    
    return matchesSearch && matchesTopic && matchesLevel && matchesType;
  });

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-background to-accent/5 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Learning Resources</h1>
              <p className="text-lg text-muted-foreground mb-6">
                Discover curated materials to help you master technical concepts and prepare for interviews.
              </p>
              
              <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search resources..."
                  className="pl-10 h-12 rounded-lg w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Main content with filters and resources */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8">
              {/* Filters Sidebar */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center">
                      <Filter className="mr-2 h-5 w-5" />
                      Filters
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    {/* Topic filter */}
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Topics</Label>
                      <div className="space-y-2">
                        {topicFilters.map(topic => (
                          <label
                            key={topic}
                            className="flex items-center cursor-pointer"
                          >
                            <input
                              type="radio"
                              name="topic"
                              checked={selectedTopic === topic}
                              onChange={() => setSelectedTopic(topic)}
                              className="mr-2 form-radio text-primary focus:ring-primary"
                            />
                            <span className="text-sm">{topic}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    {/* Level filter */}
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Levels</Label>
                      <div className="space-y-2">
                        {levelsFilters.map(level => (
                          <label
                            key={level}
                            className="flex items-center cursor-pointer"
                          >
                            <input
                              type="radio"
                              name="level"
                              checked={selectedLevel === level}
                              onChange={() => setSelectedLevel(level)}
                              className="mr-2 form-radio text-primary focus:ring-primary"
                            />
                            <span className="text-sm">{level}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    {/* Type filter */}
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Resource Types</Label>
                      <div className="space-y-2">
                        {typesFilters.map(type => (
                          <label
                            key={type}
                            className="flex items-center cursor-pointer"
                          >
                            <input
                              type="radio"
                              name="type"
                              checked={selectedType === type}
                              onChange={() => setSelectedType(type)}
                              className="mr-2 form-radio text-primary focus:ring-primary"
                            />
                            <span className="text-sm">{type}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* About section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center">
                      <BookOpen className="mr-2 h-5 w-5" />
                      About Crackit
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    <p className="mb-4">
                      We're on a mission to help students and professionals ace technical interviews through personalized learning and focused practice.
                    </p>
                    <div className="space-y-2">
                      <p className="font-medium text-foreground">Founder</p>
                      <p>Marthala Nithin Reddy</p>
                      <p className="font-medium text-foreground mt-3">Contact</p>
                      <p>📱 Phone: +91 7093569420</p>
                      <p>📧 Email: marthalanithinreddy3093@gmail.com</p>
                      <p>
                        🔗 <a href="https://linkedin.com/in/nithin-marthala" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">LinkedIn: linkedin.com/in/nithin-marthala</a>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Resources Grid */}
              <div>
                <Tabs defaultValue="all" className="mb-8">
                  <TabsList>
                    <TabsTrigger value="all">All Resources</TabsTrigger>
                    <TabsTrigger value="recommended">Recommended</TabsTrigger>
                    <TabsTrigger value="saved">Saved</TabsTrigger>
                    <TabsTrigger value="recent">Recently Viewed</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="all" className="mt-6">
                    {filteredResources.length === 0 ? (
                      <div className="text-center py-12">
                        <Book className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">No Resources Found</h3>
                        <p className="text-muted-foreground">Try adjusting your filters or search term.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredResources.map(resource => (
                          <ResourceCard
                            key={resource.id}
                            title={resource.title}
                            description={resource.description}
                            type={resource.type}
                            level={resource.level}
                            rating={resource.rating}
                            topic={resource.topic}
                            links={resource.links}
                          />
                        ))}
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="recommended" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {resources.slice(0, 3).map(resource => (
                        <ResourceCard
                          key={resource.id}
                          title={resource.title}
                          description={resource.description}
                          type={resource.type}
                          level={resource.level}
                          rating={resource.rating}
                          topic={resource.topic}
                          links={resource.links}
                        />
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="saved" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {resources.slice(3, 5).map(resource => (
                        <ResourceCard
                          key={resource.id}
                          title={resource.title}
                          description={resource.description}
                          type={resource.type}
                          level={resource.level}
                          rating={resource.rating}
                          topic={resource.topic}
                          links={resource.links}
                        />
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="recent" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {resources.slice(5, 8).map(resource => (
                        <ResourceCard
                          key={resource.id}
                          title={resource.title}
                          description={resource.description}
                          type={resource.type}
                          level={resource.level}
                          rating={resource.rating}
                          topic={resource.topic}
                          links={resource.links}
                        />
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Resources;

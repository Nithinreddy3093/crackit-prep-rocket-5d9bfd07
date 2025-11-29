import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Book, Play, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import AnimatedPage from '@/components/common/AnimatedPage';

interface ResourceItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  watchUrl?: string;
  downloadUrl?: string;
  category: 'frontend' | 'backend' | 'database' | 'tools';
}

const resourcesData: ResourceItem[] = [
  {
    id: 'git',
    title: 'Git',
    description: 'Learn here',
    icon: '🔀',
    watchUrl: 'https://www.youtube.com/results?search_query=git+tutorial',
    downloadUrl: 'https://git-scm.com/downloads',
    category: 'tools'
  },
  {
    id: 'javascript',
    title: 'Javascript',
    description: 'Learn here',
    icon: '📜',
    watchUrl: 'https://www.youtube.com/results?search_query=javascript+tutorial',
    downloadUrl: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
    category: 'frontend'
  },
  {
    id: 'typescript',
    title: 'TypeScript',
    description: 'Learn here',
    icon: '💙',
    watchUrl: 'https://www.youtube.com/results?search_query=typescript+tutorial',
    downloadUrl: 'https://www.typescriptlang.org/download',
    category: 'frontend'
  },
  {
    id: 'react',
    title: 'ReactJs',
    description: 'Learn here',
    icon: '⚛️',
    watchUrl: 'https://www.youtube.com/results?search_query=react+tutorial',
    downloadUrl: 'https://react.dev/',
    category: 'frontend'
  },
  {
    id: 'nextjs',
    title: 'NextJs',
    description: 'Learn here',
    icon: '▲',
    watchUrl: 'https://www.youtube.com/results?search_query=nextjs+tutorial',
    downloadUrl: 'https://nextjs.org/',
    category: 'frontend'
  },
  {
    id: 'tailwind',
    title: 'TailwindCSS',
    description: 'Learn here',
    icon: '🌊',
    watchUrl: 'https://www.youtube.com/results?search_query=tailwind+css+tutorial',
    downloadUrl: 'https://tailwindcss.com/docs/installation',
    category: 'frontend'
  },
  {
    id: 'backend',
    title: 'Backend',
    description: 'Learn here',
    icon: '🖥️',
    watchUrl: 'https://www.youtube.com/results?search_query=backend+development+tutorial',
    downloadUrl: 'https://nodejs.org/',
    category: 'backend'
  },
  {
    id: 'core',
    title: 'CN,OS,DBMS',
    description: 'Learn here',
    icon: '🎯',
    watchUrl: 'https://www.youtube.com/results?search_query=computer+networks+os+dbms',
    downloadUrl: 'https://www.geeksforgeeks.org/computer-science-engineering/',
    category: 'database'
  },
  {
    id: 'python',
    title: 'Python',
    description: 'Learn here',
    icon: '🐍',
    watchUrl: 'https://www.youtube.com/results?search_query=python+tutorial',
    downloadUrl: 'https://www.python.org/downloads/',
    category: 'backend'
  },
  {
    id: 'nodejs',
    title: 'Node.js',
    description: 'Learn here',
    icon: '🟢',
    watchUrl: 'https://www.youtube.com/results?search_query=nodejs+tutorial',
    downloadUrl: 'https://nodejs.org/',
    category: 'backend'
  },
  {
    id: 'mongodb',
    title: 'MongoDB',
    description: 'Learn here',
    icon: '🍃',
    watchUrl: 'https://www.youtube.com/results?search_query=mongodb+tutorial',
    downloadUrl: 'https://www.mongodb.com/try/download/community',
    category: 'database'
  },
  {
    id: 'docker',
    title: 'Docker',
    description: 'Learn here',
    icon: '🐳',
    watchUrl: 'https://www.youtube.com/results?search_query=docker+tutorial',
    downloadUrl: 'https://www.docker.com/get-started',
    category: 'tools'
  }
];

const Resources = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'frontend', 'backend', 'database', 'tools'];

  const filteredResources = resourcesData.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-darkBlue-900 via-darkBlue-800 to-darkBlue-700">
      <Navbar />
      
      <AnimatedPage className="flex-grow py-16 px-4">
        {/* Header */}
        <div className="max-w-6xl mx-auto text-center mb-12">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold text-white mb-4 flex items-center justify-center gap-3"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Book className="h-12 w-12 text-primary" />
            Learning Resources
          </motion.h1>
          <motion.p 
            className="text-lg text-white/80 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Curated materials to master web development and technical skills
          </motion.p>
          
          {/* Search */}
          <motion.div 
            className="relative max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 py-6 text-lg bg-white/10 border-white/20 text-white placeholder:text-white/60 backdrop-blur-sm"
            />
          </motion.div>

          {/* Category Filter */}
          <motion.div 
            className="flex flex-wrap justify-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {categories.map((category) => (
              <Button
                key={category}
                onClick={() => setSelectedCategory(category)}
                variant={selectedCategory === category ? 'default' : 'outline'}
                className={selectedCategory === category 
                  ? 'bg-primary text-white' 
                  : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                }
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Button>
            ))}
          </motion.div>
        </div>

        {/* Resources Grid */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredResources.map((resource, index) => (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="bg-[#1e293b] border-white/10 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1 group">
                  <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
                    {/* Icon */}
                    <div className="text-6xl mb-2 group-hover:scale-110 transition-transform duration-300">
                      {resource.icon}
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-xl font-bold text-white">
                      {resource.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-white/60 text-sm">
                      {resource.description}
                    </p>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-2 w-full">
                      <Button
                        onClick={() => window.open(resource.watchUrl, '_blank')}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                        size="sm"
                      >
                        <Play className="h-4 w-4 mr-1" />
                        Watch
                      </Button>
                      <Button
                        onClick={() => window.open(resource.downloadUrl, '_blank')}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                        size="sm"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredResources.length === 0 && (
            <motion.div 
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Search className="h-16 w-16 text-white/20 mx-auto mb-4" />
              <p className="text-white/60 text-lg">No resources found matching your search.</p>
            </motion.div>
          )}
        </div>
      </AnimatedPage>
      
      <Footer />
    </div>
  );
};

export default Resources;

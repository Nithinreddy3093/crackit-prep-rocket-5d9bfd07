
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { BookOpen, Code, Database, Cpu, Search, Download, BookOpenCheck } from 'lucide-react';

interface StudyGuide {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  pageCount: number;
  format: 'PDF' | 'EPUB' | 'HTML';
  icon: React.ReactNode;
}

const studyGuides: StudyGuide[] = [
  {
    id: 'guide-1',
    title: 'Data Structures & Algorithms Fundamentals',
    description: 'A comprehensive guide covering arrays, linked lists, trees, graphs, sorting, and searching algorithms with examples.',
    category: 'DSA',
    difficulty: 'beginner',
    pageCount: 45,
    format: 'PDF',
    icon: <Code className="h-6 w-6" />
  },
  {
    id: 'guide-2',
    title: 'Advanced Data Structures & Algorithms',
    description: 'Dive into complex algorithms, dynamic programming, and algorithmic design techniques for technical interviews.',
    category: 'DSA',
    difficulty: 'advanced',
    pageCount: 68,
    format: 'PDF',
    icon: <Code className="h-6 w-6" />
  },
  {
    id: 'guide-3',
    title: 'Database Systems: SQL & NoSQL',
    description: 'Master relational databases, learn SQL query optimization, and understand NoSQL database concepts.',
    category: 'Databases',
    difficulty: 'intermediate',
    pageCount: 52,
    format: 'PDF',
    icon: <Database className="h-6 w-6" />
  },
  {
    id: 'guide-4',
    title: 'Operating Systems Concepts',
    description: 'Understand process management, memory management, file systems, and synchronization techniques.',
    category: 'OS',
    difficulty: 'intermediate',
    pageCount: 60,
    format: 'PDF',
    icon: <Cpu className="h-6 w-6" />
  },
  {
    id: 'guide-5',
    title: 'System Design Interview Guide',
    description: 'Learn how to approach system design questions, with examples of commonly asked interview scenarios.',
    category: 'System Design',
    difficulty: 'advanced',
    pageCount: 75,
    format: 'PDF',
    icon: <BookOpen className="h-6 w-6" />
  },
  {
    id: 'guide-6',
    title: 'Web Development Fundamentals',
    description: 'Cover HTML, CSS, JavaScript, and modern frameworks with examples for front-end interviews.',
    category: 'Web Dev',
    difficulty: 'beginner',
    pageCount: 48,
    format: 'PDF',
    icon: <Code className="h-6 w-6" />
  },
  {
    id: 'guide-7',
    title: 'Machine Learning Concepts',
    description: 'Understand ML algorithms, neural networks, and common ML interview questions with examples.',
    category: 'ML',
    difficulty: 'advanced',
    pageCount: 82,
    format: 'PDF',
    icon: <BookOpen className="h-6 w-6" />
  },
  {
    id: 'guide-8',
    title: 'Object-Oriented Programming',
    description: 'Master OOP principles, design patterns, and best practices for software engineering interviews.',
    category: 'Programming',
    difficulty: 'intermediate',
    pageCount: 55,
    format: 'PDF',
    icon: <Code className="h-6 w-6" />
  },
];

const StudyGuides = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);

  // Get all unique categories
  const categories = Array.from(new Set(studyGuides.map(guide => guide.category)));
  
  // Filter guides based on search query, category and difficulty
  const filteredGuides = studyGuides.filter(guide => {
    const matchesSearch = guide.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          guide.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? guide.category === selectedCategory : true;
    const matchesDifficulty = selectedDifficulty ? guide.difficulty === selectedDifficulty : true;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const handleDownload = (guideId: string) => {
    alert(`Downloading guide ${guideId}`);
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(selectedCategory === category ? null : category);
  };

  const handleDifficultyClick = (difficulty: string) => {
    setSelectedDifficulty(selectedDifficulty === difficulty ? null : difficulty);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-darkBlue-900 via-darkBlue-800 to-darkBlue-700">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex p-3 rounded-full bg-primary/10 mb-4">
            <BookOpenCheck className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Study Guides</h1>
          <p className="text-blue-200 max-w-2xl mx-auto">
            Access our comprehensive collection of study guides to prepare for technical interviews.
            Each guide is carefully crafted by industry experts to help you succeed.
          </p>
        </div>
        
        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search study guides..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-darkBlue-700/50 border-darkBlue-600"
              />
            </div>
            <Button 
              variant={!selectedCategory && !selectedDifficulty && !searchQuery ? "default" : "outline"}
              className={!selectedCategory && !selectedDifficulty && !searchQuery ? "bg-primary" : "border-primary/50 text-primary"}
              onClick={() => {
                setSelectedCategory(null);
                setSelectedDifficulty(null);
                setSearchQuery('');
              }}
            >
              Clear Filters
            </Button>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-white/80 mb-2">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <Badge
                    key={category}
                    className={`cursor-pointer ${selectedCategory === category ? 
                      'bg-primary text-white' : 
                      'bg-darkBlue-700 text-white/70 hover:text-white border border-darkBlue-600'}`}
                    onClick={() => handleCategoryClick(category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-white/80 mb-2">Difficulty</h3>
              <div className="flex flex-wrap gap-2">
                {['beginner', 'intermediate', 'advanced'].map(difficulty => (
                  <Badge
                    key={difficulty}
                    className={`cursor-pointer ${selectedDifficulty === difficulty ? 
                      'bg-primary text-white' : 
                      'bg-darkBlue-700 text-white/70 hover:text-white border border-darkBlue-600'}`}
                    onClick={() => handleDifficultyClick(difficulty)}
                  >
                    {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Study Guides Grid */}
        {filteredGuides.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGuides.map((guide) => (
              <Card key={guide.id} className="bg-darkBlue-800/50 border-darkBlue-700 backdrop-blur-sm overflow-hidden hover:border-primary/30 transition-all">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      {guide.icon}
                    </div>
                    <Badge className={`
                      ${guide.difficulty === 'beginner' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 
                        guide.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' : 
                        'bg-red-500/20 text-red-400 border-red-500/30'}
                    `}>
                      {guide.difficulty.charAt(0).toUpperCase() + guide.difficulty.slice(1)}
                    </Badge>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-white mb-2">{guide.title}</h3>
                  <p className="text-gray-300 text-sm mb-4 line-clamp-3">{guide.description}</p>
                  
                  <div className="flex items-center justify-between text-sm text-white/60">
                    <div className="flex items-center">
                      <Badge variant="outline" className="bg-transparent border-white/20">
                        {guide.category}
                      </Badge>
                    </div>
                    <div>
                      {guide.pageCount} pages • {guide.format}
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-darkBlue-700/50 border-t border-darkBlue-600">
                  <Button 
                    onClick={() => handleDownload(guide.id)}
                    className="w-full"
                    variant="default"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Guide
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-darkBlue-800/50 backdrop-blur-sm border border-darkBlue-700 rounded-xl">
            <BookOpen className="h-12 w-12 text-white/30 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">No Study Guides Found</h2>
            <p className="text-white/70 max-w-md mx-auto">
              We couldn't find any study guides matching your search criteria. Try adjusting your filters or search term.
            </p>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default StudyGuides;

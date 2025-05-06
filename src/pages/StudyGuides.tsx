
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Book, FileText, Download, Monitor, Brain, Clock, CheckCircle, BookOpen } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';

interface StudyGuide {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  pages: number;
  downloadUrl: string;
  category: string;
}

const studyGuidesMock: StudyGuide[] = [
  {
    id: 'dsa-101',
    title: 'Data Structures & Algorithms Fundamentals',
    description: 'A comprehensive guide covering all basic data structures and algorithms concepts with examples and practice problems.',
    difficulty: 'Beginner',
    pages: 65,
    downloadUrl: '#',
    category: 'DSA'
  },
  {
    id: 'dbms-basics',
    title: 'Database Management Systems',
    description: 'Learn the core concepts of database design, normalization, SQL queries, and transaction management.',
    difficulty: 'Intermediate',
    pages: 48,
    downloadUrl: '#',
    category: 'DBMS'
  },
  {
    id: 'os-concepts',
    title: 'Operating Systems Core Concepts',
    description: 'Understand process management, memory management, file systems and other essential OS topics.',
    difficulty: 'Intermediate',
    pages: 72,
    downloadUrl: '#',
    category: 'OS'
  },
  {
    id: 'advanced-algos',
    title: 'Advanced Algorithms & Problem Solving',
    description: 'Deep dive into complex algorithms, optimization techniques, and advanced problem-solving strategies.',
    difficulty: 'Advanced',
    pages: 85,
    downloadUrl: '#',
    category: 'DSA'
  },
  {
    id: 'ai-ml-basics',
    title: 'AI & Machine Learning Fundamentals',
    description: 'Introduction to AI concepts, machine learning algorithms, neural networks, and practical applications.',
    difficulty: 'Intermediate',
    pages: 56,
    downloadUrl: '#',
    category: 'AI'
  }
];

const StudyGuides: React.FC = () => {
  const [guides, setGuides] = useState<StudyGuide[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    // Simulate API fetch with a delay
    const timer = setTimeout(() => {
      setGuides(studyGuidesMock);
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const filteredGuides = activeCategory === 'all' 
    ? guides 
    : guides.filter(guide => guide.category.toLowerCase() === activeCategory.toLowerCase());
  
  const handleDownload = (guide: StudyGuide) => {
    toast({
      title: 'Download Started',
      description: `Your study guide "${guide.title}" is downloading.`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-darkBlue-900 via-darkBlue-800 to-darkBlue-700">
      <Navbar />
      
      <main className="container max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Study Guides & Learning Resources
          </h1>
          <p className="text-blue-200 max-w-2xl mx-auto">
            Comprehensive study materials to help you master key concepts and ace your technical interviews.
            Download, study offline, and track your progress.
          </p>
        </div>
        
        <Tabs defaultValue="all" className="w-full mb-12" onValueChange={setActiveCategory}>
          <div className="flex justify-center mb-8">
            <TabsList className="bg-darkBlue-800/50 border border-darkBlue-700">
              <TabsTrigger value="all" className="data-[state=active]:bg-primary/20">
                All Guides
              </TabsTrigger>
              <TabsTrigger value="dsa" className="data-[state=active]:bg-primary/20">
                DSA
              </TabsTrigger>
              <TabsTrigger value="dbms" className="data-[state=active]:bg-primary/20">
                DBMS
              </TabsTrigger>
              <TabsTrigger value="os" className="data-[state=active]:bg-primary/20">
                OS
              </TabsTrigger>
              <TabsTrigger value="ai" className="data-[state=active]:bg-primary/20">
                AI & ML
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="all" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                Array(6).fill(0).map((_, index) => (
                  <Card key={index} className="bg-darkBlue-800 border-darkBlue-700">
                    <CardHeader>
                      <Skeleton className="h-6 w-3/4 bg-darkBlue-600 mb-2" />
                      <Skeleton className="h-4 w-1/2 bg-darkBlue-600" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-20 w-full bg-darkBlue-600 mb-4" />
                      <Skeleton className="h-10 w-full bg-darkBlue-600" />
                    </CardContent>
                  </Card>
                ))
              ) : filteredGuides.length > 0 ? (
                filteredGuides.map((guide) => (
                  <StudyGuideCard 
                    key={guide.id} 
                    guide={guide} 
                    onDownload={() => handleDownload(guide)} 
                  />
                ))
              ) : (
                <div className="col-span-3 text-center py-12">
                  <BookOpen className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl text-white">No study guides found</h3>
                  <p className="text-gray-400 mt-2">
                    There are no study guides available for this category yet.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
          
          {['dsa', 'dbms', 'os', 'ai'].map(category => (
            <TabsContent key={category} value={category} className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                  Array(2).fill(0).map((_, index) => (
                    <Card key={index} className="bg-darkBlue-800 border-darkBlue-700">
                      <CardHeader>
                        <Skeleton className="h-6 w-3/4 bg-darkBlue-600 mb-2" />
                        <Skeleton className="h-4 w-1/2 bg-darkBlue-600" />
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="h-20 w-full bg-darkBlue-600 mb-4" />
                        <Skeleton className="h-10 w-full bg-darkBlue-600" />
                      </CardContent>
                    </Card>
                  ))
                ) : filteredGuides.length > 0 ? (
                  filteredGuides.map((guide) => (
                    <StudyGuideCard 
                      key={guide.id} 
                      guide={guide} 
                      onDownload={() => handleDownload(guide)} 
                    />
                  ))
                ) : (
                  <div className="col-span-3 text-center py-12">
                    <BookOpen className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-xl text-white">No study guides found</h3>
                    <p className="text-gray-400 mt-2">
                      There are no study guides available for this category yet.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
        
        <div className="max-w-3xl mx-auto mb-16">
          <Card className="bg-darkBlue-800 border-darkBlue-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-2xl text-white flex items-center">
                <Brain className="h-6 w-6 text-primary mr-2" />
                Why Use Our Study Guides?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-white">Expert-Crafted Content</h4>
                    <p className="text-sm text-gray-400">Created by industry professionals with years of experience</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-white">Regularly Updated</h4>
                    <p className="text-sm text-gray-400">All materials are reviewed and updated quarterly</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-white">Practice Problems</h4>
                    <p className="text-sm text-gray-400">Each guide includes practice problems with solutions</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-white">Interview Focus</h4>
                    <p className="text-sm text-gray-400">Designed to prepare you for technical interviews</p>
                  </div>
                </div>
              </div>
              
              <Button 
                variant="default" 
                className="w-full"
              >
                Subscribe for Premium Access
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

interface StudyGuideCardProps {
  guide: StudyGuide;
  onDownload: () => void;
}

const StudyGuideCard: React.FC<StudyGuideCardProps> = ({ guide, onDownload }) => {
  const difficultyColor = {
    'Beginner': 'bg-green-500',
    'Intermediate': 'bg-yellow-500',
    'Advanced': 'bg-red-500',
  }[guide.difficulty];
  
  return (
    <Card className="bg-darkBlue-800 border-darkBlue-700 hover:border-primary/50 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <span className={`inline-block px-2 py-1 text-xs rounded-md text-white ${difficultyColor} mb-2`}>
              {guide.difficulty}
            </span>
            <CardTitle className="text-lg text-white">{guide.title}</CardTitle>
          </div>
          <Book className="h-6 w-6 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-400 text-sm mb-4 h-16 overflow-hidden">{guide.description}</p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-gray-400 text-xs">
            <FileText className="h-4 w-4 mr-1" />
            {guide.pages} pages
          </div>
          <div className="flex items-center text-gray-400 text-xs">
            <Clock className="h-4 w-4 mr-1" />
            {Math.round(guide.pages / 10)} hrs read time
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant="outline" 
            size="sm"
            className="border-darkBlue-700 hover:bg-darkBlue-700"
          >
            <Monitor className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button 
            variant="default" 
            size="sm"
            onClick={onDownload}
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudyGuides;


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ResourceCard, { ResourceProps } from '@/components/ResourceCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Search, Filter, SortAsc, SortDesc } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// Mock resource data
const mockResources: ResourceProps[] = [
  {
    id: '1',
    title: 'Introduction to Data Structures & Algorithms',
    description: 'A comprehensive guide to understanding the fundamentals of data structures and algorithms for beginners.',
    type: 'article',
    level: 'beginner',
    topic: 'DSA',
    url: 'https://example.com/intro-to-dsa',
    ratings: 4.5,
    isFavorite: false,
    createdAt: '2025-03-15T10:00:00Z',
  },
  {
    id: '2',
    title: 'Advanced Database Management Concepts',
    description: 'Deep dive into advanced database management systems including normalization, indexing strategies, and query optimization.',
    type: 'video',
    level: 'advanced',
    topic: 'DBMS',
    url: 'https://example.com/advanced-dbms',
    ratings: 4.8,
    isFavorite: true,
    createdAt: '2025-03-10T14:30:00Z',
  },
  {
    id: '3',
    title: 'Operating Systems: Memory Management',
    description: 'Learn how operating systems handle memory allocation, virtual memory, and paging mechanisms.',
    type: 'documentation',
    level: 'intermediate',
    topic: 'OS',
    url: 'https://example.com/os-memory',
    ratings: 4.2,
    isFavorite: false,
    createdAt: '2025-03-05T09:15:00Z',
  },
  {
    id: '4',
    title: 'Leetcode Problem Solving Patterns',
    description: 'Master the common patterns to solve algorithm problems efficiently in technical interviews.',
    type: 'course',
    level: 'intermediate',
    topic: 'DSA',
    url: 'https://example.com/leetcode-patterns',
    ratings: 4.9,
    isFavorite: true,
    createdAt: '2025-02-28T16:45:00Z',
  },
  {
    id: '5',
    title: 'Network Protocols and Security',
    description: 'Understand the fundamentals of network protocols and how to implement security measures to protect systems.',
    type: 'video',
    level: 'advanced',
    topic: 'Networking',
    url: 'https://example.com/network-security',
    ratings: 4.7,
    isFavorite: false,
    createdAt: '2025-02-20T11:30:00Z',
  },
  {
    id: '6',
    title: 'Git & GitHub for Beginners',
    description: 'Learn the basics of version control using Git and GitHub to manage your projects efficiently.',
    type: 'course',
    level: 'beginner',
    topic: 'Tools',
    url: 'https://example.com/git-github',
    ratings: 4.6,
    isFavorite: true,
    createdAt: '2025-02-15T13:20:00Z',
  },
  {
    id: '7',
    title: 'JavaScript Design Patterns',
    description: 'Explore common design patterns in JavaScript to write maintainable and scalable code.',
    type: 'documentation',
    level: 'intermediate',
    topic: 'Web Development',
    url: 'https://example.com/js-patterns',
    ratings: 4.3,
    isFavorite: false,
    createdAt: '2025-02-10T10:45:00Z',
  },
  {
    id: '8',
    title: 'Introduction to Machine Learning',
    description: 'Get started with machine learning concepts, algorithms, and practical applications.',
    type: 'article',
    level: 'beginner',
    topic: 'ML',
    url: 'https://example.com/intro-ml',
    ratings: 4.4,
    isFavorite: true,
    createdAt: '2025-02-05T09:00:00Z',
  },
  {
    id: '9',
    title: 'Cloud Computing Fundamentals',
    description: 'Learn the basics of cloud computing, service models, and deployment strategies.',
    type: 'video',
    level: 'beginner',
    topic: 'Cloud',
    url: 'https://example.com/cloud-computing',
    ratings: 4.1,
    isFavorite: false,
    createdAt: '2025-01-30T14:15:00Z',
  },
  {
    id: '10',
    title: 'Algorithms Complexity Analysis',
    description: 'Master the techniques to analyze algorithm time and space complexity for optimization.',
    type: 'course',
    level: 'advanced',
    topic: 'DSA',
    url: 'https://example.com/algo-complexity',
    ratings: 4.8,
    isFavorite: true,
    createdAt: '2025-01-25T11:30:00Z',
  },
  {
    id: '11',
    title: 'Distributed Systems Architecture',
    description: 'Understand the principles and challenges of designing and maintaining distributed systems.',
    type: 'documentation',
    level: 'advanced',
    topic: 'Systems Design',
    url: 'https://example.com/distributed-systems',
    ratings: 4.7,
    isFavorite: false,
    createdAt: '2025-01-20T16:00:00Z',
  },
  {
    id: '12',
    title: 'Responsive Web Design Principles',
    description: 'Learn how to create websites that look great on all devices using responsive design techniques.',
    type: 'article',
    level: 'intermediate',
    topic: 'Web Development',
    url: 'https://example.com/responsive-design',
    ratings: 4.5,
    isFavorite: true,
    createdAt: '2025-01-15T09:45:00Z',
  },
];

const Resources = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [resources, setResources] = useState<ResourceProps[]>(mockResources);
  const [filteredResources, setFilteredResources] = useState<ResourceProps[]>(mockResources);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [topicFilter, setTopicFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const resourcesPerPage = 8;

  // Get all unique topics, types, and levels for filters
  const uniqueTopics = Array.from(new Set(resources.map(r => r.topic)));
  const uniqueTypes = Array.from(new Set(resources.map(r => r.type)));
  const uniqueLevels = Array.from(new Set(resources.map(r => r.level)));

  // Apply filters and sorting
  useEffect(() => {
    let result = [...resources];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        resource => 
          resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          resource.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply type filter
    if (typeFilter !== 'all') {
      result = result.filter(resource => resource.type === typeFilter);
    }
    
    // Apply level filter
    if (levelFilter !== 'all') {
      result = result.filter(resource => resource.level === levelFilter);
    }
    
    // Apply topic filter
    if (topicFilter !== 'all') {
      result = result.filter(resource => resource.topic === topicFilter);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      if (sortBy === 'date') {
        return sortDirection === 'asc' 
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortBy === 'title') {
        return sortDirection === 'asc'
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      } else if (sortBy === 'rating') {
        const ratingA = a.ratings || 0;
        const ratingB = b.ratings || 0;
        return sortDirection === 'asc' ? ratingA - ratingB : ratingB - ratingA;
      }
      return 0;
    });
    
    setFilteredResources(result);
    setCurrentPage(1);
  }, [resources, searchTerm, typeFilter, levelFilter, topicFilter, sortBy, sortDirection]);

  // Calculate pagination
  const indexOfLastResource = currentPage * resourcesPerPage;
  const indexOfFirstResource = indexOfLastResource - resourcesPerPage;
  const currentResources = filteredResources.slice(indexOfFirstResource, indexOfLastResource);
  const totalPages = Math.ceil(filteredResources.length / resourcesPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Toggle sort direction
  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setTypeFilter('all');
    setLevelFilter('all');
    setTopicFilter('all');
    setSortBy('date');
    setSortDirection('desc');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow">
        <section className="py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-darkBlue-900 to-darkBlue-800">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Learning Resources
              </h1>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                Explore curated resources to enhance your knowledge and skills in various topics.
              </p>
            </div>
          </div>
        </section>

        {/* Filters and Search */}
        <section className="py-8 px-4 sm:px-6 lg:px-8 bg-darkBlue-900/30">
          <div className="max-w-7xl mx-auto">
            <div className="bg-darkBlue-800 rounded-xl p-6 shadow-lg border border-darkBlue-700">
              <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
                <div className="relative w-full md:max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    type="text"
                    placeholder="Search resources..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-darkBlue-700 border-darkBlue-600 text-white placeholder:text-gray-400"
                  />
                </div>
                <div className="flex flex-wrap gap-2 items-center w-full md:w-auto">
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-[140px] bg-darkBlue-700 border-darkBlue-600 text-white">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent className="bg-darkBlue-700 border-darkBlue-600 text-white">
                      <SelectItem value="all">All Types</SelectItem>
                      {uniqueTypes.map(type => (
                        <SelectItem key={type} value={type} className="capitalize">{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={levelFilter} onValueChange={setLevelFilter}>
                    <SelectTrigger className="w-[140px] bg-darkBlue-700 border-darkBlue-600 text-white">
                      <SelectValue placeholder="Level" />
                    </SelectTrigger>
                    <SelectContent className="bg-darkBlue-700 border-darkBlue-600 text-white">
                      <SelectItem value="all">All Levels</SelectItem>
                      {uniqueLevels.map(level => (
                        <SelectItem key={level} value={level} className="capitalize">{level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={topicFilter} onValueChange={setTopicFilter}>
                    <SelectTrigger className="w-[140px] bg-darkBlue-700 border-darkBlue-600 text-white">
                      <SelectValue placeholder="Topic" />
                    </SelectTrigger>
                    <SelectContent className="bg-darkBlue-700 border-darkBlue-600 text-white">
                      <SelectItem value="all">All Topics</SelectItem>
                      {uniqueTopics.map(topic => (
                        <SelectItem key={topic} value={topic}>{topic}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex flex-wrap justify-between items-center">
                <div className="flex items-center gap-2 mb-4 md:mb-0">
                  <p className="text-gray-300 text-sm">
                    {filteredResources.length} resources found
                  </p>
                  {(searchTerm || typeFilter !== 'all' || levelFilter !== 'all' || topicFilter !== 'all') && (
                    <Button 
                      variant="ghost" 
                      onClick={resetFilters}
                      className="text-xs h-8 px-2 text-gray-300 hover:text-white hover:bg-darkBlue-700"
                    >
                      Reset filters
                    </Button>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <p className="text-gray-300 text-sm">Sort by:</p>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[140px] bg-darkBlue-700 border-darkBlue-600 text-white">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent className="bg-darkBlue-700 border-darkBlue-600 text-white">
                      <SelectItem value="date">Date Added</SelectItem>
                      <SelectItem value="title">Title</SelectItem>
                      <SelectItem value="rating">Rating</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={toggleSortDirection}
                    className="h-10 w-10 border-darkBlue-600 text-white hover:bg-darkBlue-700"
                  >
                    {sortDirection === 'asc' ? <SortAsc size={18} /> : <SortDesc size={18} />}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Resources Grid */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {currentResources.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {currentResources.map((resource) => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-gray-300 text-lg">No resources found matching your criteria.</p>
                <Button 
                  variant="outline" 
                  onClick={resetFilters}
                  className="mt-4 border-primary text-primary hover:bg-primary/10"
                >
                  Clear filters
                </Button>
              </div>
            )}
            
            {/* Pagination */}
            {filteredResources.length > resourcesPerPage && (
              <div className="mt-12">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: Math.min(5, totalPages) }).map((_, index) => {
                      let pageNumber;
                      if (totalPages <= 5) {
                        pageNumber = index + 1;
                      } else if (currentPage <= 3) {
                        pageNumber = index + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNumber = totalPages - 4 + index;
                      } else {
                        pageNumber = currentPage - 2 + index;
                      }
                      
                      if (pageNumber > 0 && pageNumber <= totalPages) {
                        return (
                          <PaginationItem key={pageNumber}>
                            <PaginationLink 
                              isActive={currentPage === pageNumber}
                              onClick={() => handlePageChange(pageNumber)}
                            >
                              {pageNumber}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      }
                      return null;
                    })}
                    
                    {totalPages > 5 && currentPage < totalPages - 2 && (
                      <>
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink onClick={() => handlePageChange(totalPages)}>
                            {totalPages}
                          </PaginationLink>
                        </PaginationItem>
                      </>
                    )}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Resources;

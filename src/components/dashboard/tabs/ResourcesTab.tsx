
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ArrowUpRight, Rocket, MousePointerClick } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SavedResources from '@/components/dashboard/SavedResources';
import RecentlyViewed from '@/components/dashboard/RecentlyViewed';

// Mock data for resources
const savedResources = [
  { id: 1, title: 'Database Normalization Explained', type: 'Video', topic: 'DBMS', savedOn: 'April 8, 2025', url: 'https://www.youtube.com/watch?v=UrYLYV7WSHM' },
  { id: 2, title: 'Advanced Algorithm Techniques', type: 'Article', topic: 'DSA', savedOn: 'April 5, 2025', url: 'https://www.geeksforgeeks.org/advanced-data-structures/' },
  { id: 3, title: 'Memory Management in OS', type: 'Course', topic: 'OS', savedOn: 'April 2, 2025', url: 'https://www.coursera.org/learn/operating-systems' },
];

const ResourcesTab: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="glass-card p-6 hover:shadow-blue-500/10 dashboard-card-hover">
      <div className="flex justify-between items-center mb-6">
        <h3 className="section-title mb-0">
          <BookOpen className="section-icon" />
          Your Learning Resources
        </h3>
        <Button 
          onClick={() => navigate('/resources')}
          className="bg-primary hover:bg-primary/90 text-white"
        >
          Browse All Resources
          <ArrowUpRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
      
      <SavedResources resources={savedResources} />
      <div className="mt-8">
        <h3 className="section-title">
          <MousePointerClick className="section-icon" />
          Recently Viewed
        </h3>
        <RecentlyViewed />
      </div>
      
      <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
        <h4 className="font-semibold text-white mb-2 flex items-center">
          <Rocket className="h-4 w-4 mr-2 text-blue-400" />
          Enhanced Learning Resources
        </h4>
        <p className="text-white/80 text-sm mb-3">
          Explore these handpicked resources to accelerate your learning.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a 
            href="https://www.geeksforgeeks.org/data-structures/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
          >
            <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center mr-3">
              <BookOpen className="h-4 w-4 text-green-400" />
            </div>
            <div className="flex-1">
              <h5 className="font-medium text-white text-sm">Data Structures</h5>
              <p className="text-xs text-white/70">GeeksforGeeks Guide</p>
            </div>
          </a>
          <a 
            href="https://leetcode.com/list/xi4ci4ig/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
          >
            <div className="h-8 w-8 rounded-full bg-orange-500/20 flex items-center justify-center mr-3">
              <ListChecks className="h-4 w-4 text-orange-400" />
            </div>
            <div className="flex-1">
              <h5 className="font-medium text-white text-sm">Blind 75 Problems</h5>
              <p className="text-xs text-white/70">LeetCode Collection</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ResourcesTab;


import React from 'react';
import { BookMarked } from 'lucide-react';
import ListChecks from '@/components/dashboard/ListChecks';
import SavedResources from '@/components/dashboard/SavedResources';

const ResourcesTab: React.FC = () => {
  return (
    <>
      <div className="glass-card p-6 hover:shadow-blue-500/10 dashboard-card-hover">
        <h3 className="section-title">
          <BookMarked className="section-icon" />
          Learning Resources
        </h3>
        <SavedResources />
      </div>
      <div className="glass-card p-6 hover:shadow-blue-500/10 dashboard-card-hover">
        <h3 className="section-title">
          <ListChecks />
          Recommended Reading
        </h3>
        <div className="space-y-4 mt-4">
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <h4 className="font-semibold text-white mb-2">Advanced Data Structures</h4>
            <p className="text-sm text-white/70">Learn about advanced data structures like Red-Black trees, B-trees, and their applications.</p>
            <div className="flex justify-between items-center mt-3">
              <span className="text-xs text-primary">Article • 15 min read</span>
              <a href="#" className="text-xs text-blue-400 hover:underline">Read Now</a>
            </div>
          </div>
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <h4 className="font-semibold text-white mb-2">Database Optimization Techniques</h4>
            <p className="text-sm text-white/70">Explore methods to optimize database performance including indexing and query optimization.</p>
            <div className="flex justify-between items-center mt-3">
              <span className="text-xs text-primary">Tutorial • 20 min read</span>
              <a href="#" className="text-xs text-blue-400 hover:underline">Read Now</a>
            </div>
          </div>
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <h4 className="font-semibold text-white mb-2">Algorithms for Machine Learning</h4>
            <p className="text-sm text-white/70">Introduction to common algorithms used in machine learning and their implementations.</p>
            <div className="flex justify-between items-center mt-3">
              <span className="text-xs text-primary">Video • 30 min</span>
              <a href="#" className="text-xs text-blue-400 hover:underline">Watch Now</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResourcesTab;

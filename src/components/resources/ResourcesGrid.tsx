
import React from 'react';
import ResourceCard, { ResourceProps } from '@/components/ResourceCard';
import { Button } from '@/components/ui/button';

interface ResourcesGridProps {
  resources: ResourceProps[];
  resetFilters: () => void;
}

const ResourcesGrid: React.FC<ResourcesGridProps> = ({ resources, resetFilters }) => {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {resources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {resources.map((resource) => (
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
      </div>
    </section>
  );
};

export default ResourcesGrid;

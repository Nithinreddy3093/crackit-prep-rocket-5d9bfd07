
import React from 'react';
import { Button } from '@/components/ui/button';
import { BookX } from 'lucide-react';

interface EmptyStateProps {
  onClearFilters: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onClearFilters }) => {
  return (
    <div className="py-16 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-darkBlue-800 mb-4">
        <BookX className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-medium text-foreground mb-2">No topics found</h3>
      <p className="text-muted-foreground mb-6">
        Try adjusting your search or filter to find what you're looking for.
      </p>
      <Button onClick={onClearFilters} variant="outline" className="border-primary text-primary">
        Clear Filters
      </Button>
    </div>
  );
};

export default EmptyState;

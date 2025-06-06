
import React, { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';

interface EnhancedSearchFilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  difficultyFilter: string;
  setDifficultyFilter: (filter: string) => void;
  totalTopics: number;
  filteredCount: number;
}

const EnhancedSearchFilterBar: React.FC<EnhancedSearchFilterBarProps> = ({
  searchQuery,
  setSearchQuery,
  difficultyFilter,
  setDifficultyFilter,
  totalTopics,
  filteredCount
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setDifficultyFilter('all');
  }, [setSearchQuery, setDifficultyFilter]);

  const hasActiveFilters = searchQuery.trim() !== '' || difficultyFilter !== 'all';

  return (
    <div className="mb-8 space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-muted-foreground" />
          </div>
          <Input
            type="text"
            className="block w-full pl-10 pr-10 py-3 border border-border rounded-lg bg-background/80 backdrop-blur-sm text-foreground focus:ring-primary focus:border-primary transition-all duration-200"
            placeholder="Search topics by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        
        <div className="flex gap-2">
          <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
            <SelectTrigger className="w-full sm:w-48 bg-background/80 backdrop-blur-sm">
              <SelectValue placeholder="Filter by difficulty" />
            </SelectTrigger>
            <SelectContent className="bg-background/95 backdrop-blur-md border border-border/50">
              <SelectGroup>
                <SelectLabel>Difficulty Level</SelectLabel>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="whitespace-nowrap bg-background/80 backdrop-blur-sm hover:bg-background/90"
            >
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Results summary */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div>
          Showing {filteredCount} of {totalTopics} topics
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-2">
              Filtered
            </Badge>
          )}
        </div>
        
        {hasActiveFilters && (
          <div className="flex items-center gap-2">
            {searchQuery && (
              <Badge variant="outline" className="text-xs">
                Search: "{searchQuery}"
              </Badge>
            )}
            {difficultyFilter !== 'all' && (
              <Badge variant="outline" className="text-xs">
                {difficultyFilter}
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedSearchFilterBar;

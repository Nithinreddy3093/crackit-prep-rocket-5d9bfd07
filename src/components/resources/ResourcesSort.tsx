
import React from 'react';
import { SortAsc, SortDesc } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ResourcesSortProps {
  sortBy: string;
  sortDirection: 'asc' | 'desc';
  setSortBy: (value: string) => void;
  toggleSortDirection: () => void;
}

const ResourcesSort: React.FC<ResourcesSortProps> = ({
  sortBy,
  sortDirection,
  setSortBy,
  toggleSortDirection,
}) => {
  return (
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
  );
};

export default ResourcesSort;

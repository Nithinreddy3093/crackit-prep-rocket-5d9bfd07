
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ResourceProps } from '@/components/ResourceCard';

interface ResourcesFilterProps {
  searchTerm: string;
  typeFilter: string;
  levelFilter: string;
  topicFilter: string;
  uniqueTypes: string[];
  uniqueLevels: string[];
  uniqueTopics: string[];
  filteredCount: number;
  setSearchTerm: (value: string) => void;
  setTypeFilter: (value: string) => void;
  setLevelFilter: (value: string) => void;
  setTopicFilter: (value: string) => void;
  resetFilters: () => void;
}

const ResourcesFilter: React.FC<ResourcesFilterProps> = ({
  searchTerm,
  typeFilter,
  levelFilter,
  topicFilter,
  uniqueTypes,
  uniqueLevels,
  uniqueTopics,
  filteredCount,
  setSearchTerm,
  setTypeFilter,
  setLevelFilter,
  setTopicFilter,
  resetFilters,
}) => {
  const hasActiveFilters = searchTerm || typeFilter !== 'all' || levelFilter !== 'all' || topicFilter !== 'all';

  return (
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
                {filteredCount} resources found
              </p>
              {hasActiveFilters && (
                <Button 
                  variant="ghost" 
                  onClick={resetFilters}
                  className="text-xs h-8 px-2 text-gray-300 hover:text-white hover:bg-darkBlue-700"
                >
                  Reset filters
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResourcesFilter;

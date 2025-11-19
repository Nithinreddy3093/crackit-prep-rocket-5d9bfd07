import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ResourceCard from '@/components/resources/ResourceCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, Filter, Book } from 'lucide-react';
import { useResources } from '@/hooks/useResources';
import { Skeleton } from '@/components/ui/skeleton';

const Resources = () => {
  const { resources, loading } = useResources();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');

  const topics = ['all', ...Array.from(new Set(resources.map(r => r.topic)))];
  const levels = ['all', 'beginner', 'intermediate', 'advanced'];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTopic = selectedTopic === 'all' || resource.topic === selectedTopic;
    const matchesLevel = selectedLevel === 'all' || resource.difficulty.toLowerCase() === selectedLevel;
    return matchesSearch && matchesTopic && matchesLevel;
  });

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-darkBlue-900 via-darkBlue-800 to-darkBlue-700">
      <Navbar />
      
      <section className="py-16 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <Book className="h-12 w-12 text-primary" />
            Learning Resources
          </h1>
          <p className="text-lg text-white/80 mb-8">Curated materials to ace your technical interviews</p>
          
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              type="text"
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 py-6 text-lg bg-background/50 backdrop-blur-sm"
            />
          </div>
        </div>
      </section>
      
      <section className="py-12 px-4 mb-20 md:mb-0">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8">
            <Card className="bg-card/50 h-fit">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="mr-2 h-5 w-5" />Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div>
                  <Label className="text-sm font-medium mb-2 block">Topics</Label>
                  <div className="space-y-2">
                    {topics.map(topic => (
                      <label key={topic} className="flex items-center cursor-pointer">
                        <input type="radio" name="topic" checked={selectedTopic === topic}
                          onChange={() => setSelectedTopic(topic)}
                          className="mr-2 form-radio text-primary" />
                        <span className="text-sm capitalize">{topic}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium mb-2 block">Difficulty</Label>
                  <div className="space-y-2">
                    {levels.map(level => (
                      <label key={level} className="flex items-center cursor-pointer">
                        <input type="radio" name="level" checked={selectedLevel === level}
                          onChange={() => setSelectedLevel(level)}
                          className="mr-2 form-radio text-primary" />
                        <span className="text-sm capitalize">{level}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div>
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <Card key={i}><CardContent className="p-6">
                      <Skeleton className="h-8 w-3/4 mb-4" />
                      <Skeleton className="h-4 w-full mb-2" />
                    </CardContent></Card>
                  ))}
                </div>
              ) : filteredResources.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredResources.map((resource) => (
                    <ResourceCard key={resource.id} {...resource} />
                  ))}
                </div>
              ) : (
                <Card className="p-12 text-center"><div className="text-muted-foreground">
                  <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No resources found</p>
                </div></Card>
              )}
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Resources;


import React from 'react';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useNavigate } from 'react-router-dom';

export interface SavedResource {
  id: number;
  title: string;
  type: string;
  topic: string;
  savedOn: string;
  url: string;
}

interface SavedResourcesProps {
  resources: SavedResource[];
}

const SavedResources: React.FC<SavedResourcesProps> = ({ resources }) => {
  const navigate = useNavigate();
  
  return (
    <Card className="bg-darkBlue-800 border-darkBlue-700">
      <CardHeader>
        <CardTitle className="text-xl text-white">Saved Resources</CardTitle>
        <CardDescription className="text-gray-400">
          Resources you've bookmarked for later
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="border-darkBlue-700">
              <TableHead className="text-gray-300">Title</TableHead>
              <TableHead className="text-gray-300">Type</TableHead>
              <TableHead className="text-gray-300">Topic</TableHead>
              <TableHead className="text-gray-300">Saved On</TableHead>
              <TableHead className="text-gray-300 text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {resources.map(resource => (
              <TableRow key={resource.id} className="border-darkBlue-700">
                <TableCell className="font-medium text-white">{resource.title}</TableCell>
                <TableCell className="text-gray-300">{resource.type}</TableCell>
                <TableCell className="text-gray-300">{resource.topic}</TableCell>
                <TableCell className="text-gray-300">{resource.savedOn}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="h-8 text-primary hover:bg-primary/10" asChild>
                    <a href={resource.url} className="flex items-center" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="border-t border-darkBlue-700 mt-2">
        <Button 
          variant="ghost" 
          className="w-full text-primary hover:bg-darkBlue-700"
          onClick={() => navigate('/resources')}
        >
          View All Saved Resources
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SavedResources;

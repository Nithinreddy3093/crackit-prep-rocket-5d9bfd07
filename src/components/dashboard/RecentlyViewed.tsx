
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Video, FileText, ExternalLink } from 'lucide-react';

const RecentlyViewed: React.FC = () => {
  return (
    <Card className="bg-darkBlue-800 border-darkBlue-700">
      <CardHeader>
        <CardTitle className="text-xl text-white">Recently Viewed</CardTitle>
        <CardDescription className="text-gray-400">
          Resources you've recently accessed
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start p-3 bg-darkBlue-700 rounded-lg hover:bg-darkBlue-600 transition-colors">
            <div className="bg-primary/10 p-2 rounded-md mr-3">
              <Video className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-white text-sm font-medium">SQL Query Optimization Techniques</p>
              <p className="text-gray-400 text-xs mt-1">
                Video • 22 minutes • Viewed yesterday
              </p>
            </div>
            <Button size="sm" variant="ghost" className="h-8 text-primary hover:bg-primary/10" asChild>
              <a href="#" className="flex items-center">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
          <div className="flex items-start p-3 bg-darkBlue-700 rounded-lg hover:bg-darkBlue-600 transition-colors">
            <div className="bg-primary/10 p-2 rounded-md mr-3">
              <FileText className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-white text-sm font-medium">Balanced Trees: Complete Guide</p>
              <p className="text-gray-400 text-xs mt-1">
                Article • 15 min read • Viewed 2 days ago
              </p>
            </div>
            <Button size="sm" variant="ghost" className="h-8 text-primary hover:bg-primary/10" asChild>
              <a href="#" className="flex items-center">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentlyViewed;

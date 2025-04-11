
import React from 'react';
import { Brain, Target, BookOpen, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const AiRecommendations = () => {
  const handleStartPractice = () => {
    toast({
      title: "Focused Practice",
      description: "Your personalized practice session is being prepared.",
      variant: "default",
    });
  };

  return (
    <Card className="bg-darkBlue-800 border-darkBlue-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl text-white">AI Recommendations</CardTitle>
          <Brain className="h-5 w-5 text-primary" />
        </div>
        <CardDescription className="text-gray-400">
          Personalized based on your performance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 rounded-xl bg-darkBlue-700/50 border border-darkBlue-600">
            <div className="flex items-center mb-4">
              <div className="bg-primary/10 p-3 rounded-lg mr-4">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-white">Focus Areas</h3>
                <p className="text-sm text-gray-400">Based on your quiz results</p>
              </div>
            </div>
            <ul className="space-y-2 mb-4">
              <li className="text-gray-300 text-sm flex items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                Database Normalization concepts need attention
              </li>
              <li className="text-gray-300 text-sm flex items-center">
                <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                Process Scheduling algorithms need review
              </li>
              <li className="text-gray-300 text-sm flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Strong understanding of array and string algorithms
              </li>
            </ul>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full border-darkBlue-600 text-primary hover:bg-primary/10"
              onClick={handleStartPractice}
            >
              Start Focused Practice
            </Button>
          </div>
          
          <div className="p-5 rounded-xl bg-darkBlue-700/50 border border-darkBlue-600">
            <div className="flex items-center mb-4">
              <div className="bg-primary/10 p-3 rounded-lg mr-4">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-white">Recommended Resources</h3>
                <p className="text-sm text-gray-400">Curated for your needs</p>
              </div>
            </div>
            <div className="space-y-3 mb-4">
              <div className="flex items-start p-3 bg-darkBlue-700 rounded-lg hover:bg-darkBlue-600 transition-colors">
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">Database Normalization Simplified</p>
                  <p className="text-gray-400 text-xs mt-1 flex items-center">
                    Video tutorial • 15 minutes
                  </p>
                </div>
                <Button size="sm" variant="ghost" className="h-8 text-primary hover:bg-primary/10" asChild>
                  <a href="#" className="flex items-center">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
              <div className="flex items-start p-3 bg-darkBlue-700 rounded-lg hover:bg-darkBlue-600 transition-colors">
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">OS Scheduling Algorithms Explained</p>
                  <p className="text-gray-400 text-xs mt-1 flex items-center">
                    Article • 8 min read
                  </p>
                </div>
                <Button size="sm" variant="ghost" className="h-8 text-primary hover:bg-primary/10" asChild>
                  <a href="#" className="flex items-center">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full border-darkBlue-600 text-primary hover:bg-primary/10"
              onClick={() => window.location.href = '/resources'}
            >
              View All Resources
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AiRecommendations;

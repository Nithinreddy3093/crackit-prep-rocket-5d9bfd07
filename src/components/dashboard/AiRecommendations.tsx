
import React, { useEffect, useState } from 'react';
import { Brain, Target, BookOpen, ExternalLink, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { getSuggestedResources, getUserPerformance, getAIRecommendations } from '@/services/supabasePerformanceService';
import { useAuth } from '@/contexts/AuthContext';

const AiRecommendations = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [weakTopics, setWeakTopics] = useState<string[]>([]);
  const [resources, setResources] = useState<any[]>([]);
  const [aiRecommendation, setAiRecommendation] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (user) {
          const performance = await getUserPerformance(user.id);
          if (performance) {
            setWeakTopics(performance.weakTopics);
          }
          
          const suggestedResources = await getSuggestedResources(user.id);
          setResources(suggestedResources.slice(0, 2)); // Only show 2 resources
          
          const recommendation = await getAIRecommendations(user.id);
          setAiRecommendation(recommendation);
        }
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleStartPractice = () => {
    toast({
      title: "Focused Practice",
      description: "Your personalized practice session is being prepared.",
      variant: "default",
    });
  };

  if (loading) {
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
        <CardContent className="min-h-[300px] flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
            <p className="text-gray-400">Loading your recommendations...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

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
        {/* AI Insight Box */}
        <div className="p-4 mb-6 rounded-xl bg-primary/10 border border-primary/30">
          <h3 className="font-medium text-white flex items-center">
            <Brain className="h-4 w-4 mr-2 text-primary" />
            AI Insight
          </h3>
          <p className="text-white/80 mt-2 text-sm">
            {aiRecommendation}
          </p>
        </div>
      
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
              {weakTopics.length > 0 ? (
                weakTopics.map((topic, index) => (
                  <li key={index} className="text-gray-300 text-sm flex items-center">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                    {topic} concepts need attention
                  </li>
                ))
              ) : (
                <li className="text-gray-300 text-sm">
                  Complete more quizzes to get personalized recommendations
                </li>
              )}
              <li className="text-gray-300 text-sm flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Keep practicing to improve your skills
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
              {resources.length > 0 ? (
                resources.map((resource, index) => (
                  <div key={index} className="flex items-start p-3 bg-darkBlue-700 rounded-lg hover:bg-darkBlue-600 transition-colors">
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">{resource.title}</p>
                      <p className="text-gray-400 text-xs mt-1 flex items-center">
                        {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                        {' • '}{resource.description.substring(0, 30)}...
                      </p>
                    </div>
                    <Button size="sm" variant="ghost" className="h-8 text-primary hover:bg-primary/10" asChild>
                      <a href={resource.url} target="_blank" rel="noopener noreferrer" className="flex items-center">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                ))
              ) : (
                <div className="p-3 bg-darkBlue-700 rounded-lg">
                  <p className="text-gray-300 text-sm">Complete more quizzes to get personalized recommendations</p>
                </div>
              )}
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

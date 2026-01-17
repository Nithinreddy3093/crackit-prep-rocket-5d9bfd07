import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Brain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Recommendation {
  topic: string;
  reason: string;
  difficulty: string;
}

interface ContinueLearningProps {
  recommendations: Recommendation[];
}

const ContinueLearning: React.FC<ContinueLearningProps> = ({ recommendations }) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          Continue Learning
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {recommendations.map((rec, index) => (
          <div 
            key={index}
            className="p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <h4 className="font-semibold text-foreground mb-1">{rec.topic}</h4>
                <p className="text-sm text-muted-foreground mb-2">{rec.reason}</p>
                <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                  {rec.difficulty}
                </span>
              </div>
              <Button 
                size="sm" 
                variant="ghost"
                onClick={() => navigate(`/quiz/${encodeURIComponent(rec.topic)}`)}
              >
                Start <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ContinueLearning;

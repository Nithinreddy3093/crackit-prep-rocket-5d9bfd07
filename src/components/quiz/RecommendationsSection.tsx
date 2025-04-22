
import { Brain, BookOpen, Target, BarChart2, ExternalLink } from 'lucide-react';
import { AIFeedback } from '@/services/geminiService';

interface RecommendationsSectionProps {
  recommendations: AIFeedback['recommendations'];
}

const RecommendationsSection: React.FC<RecommendationsSectionProps> = ({ recommendations }) => {
  return (
    <div className="mb-6">
      <h4 className="flex items-center text-foreground font-medium mb-3">
        <Brain className="h-5 w-5 mr-2 text-primary" />
        AI-Powered Recommendations
      </h4>
      <div className="space-y-3">
        {recommendations.map((rec, index) => (
          <a 
            key={index} 
            href={rec.link}
            target="_blank"
            rel="noopener noreferrer" 
            className="flex items-start p-3 bg-background hover:bg-muted transition-colors rounded-lg"
          >
            {rec.type === 'video' && <BookOpen className="h-5 w-5 mr-3 text-blue-500 flex-shrink-0 mt-0.5" />}
            {rec.type === 'article' && <Target className="h-5 w-5 mr-3 text-purple-500 flex-shrink-0 mt-0.5" />}
            {rec.type === 'practice' && <BarChart2 className="h-5 w-5 mr-3 text-green-500 flex-shrink-0 mt-0.5" />}
            <div className="flex-1">
              <p className="text-foreground text-sm font-medium">{rec.title}</p>
              <p className="text-muted-foreground text-xs mt-1 flex items-center">
                {rec.type === 'video' && 'Video tutorial'}
                {rec.type === 'article' && 'Article'}
                {rec.type === 'practice' && 'Practice exercises'}
                <ExternalLink className="h-3 w-3 ml-1" />
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default RecommendationsSection;

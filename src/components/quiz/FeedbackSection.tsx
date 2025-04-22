
import { CheckCircle, XCircle } from 'lucide-react';

interface FeedbackSectionProps {
  strengths: string[];
  weaknesses: string[];
}

const FeedbackSection: React.FC<FeedbackSectionProps> = ({ strengths, weaknesses }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div className="bg-green-500/10 dark:bg-green-500/5 p-4 rounded-lg border border-green-500/20">
        <h4 className="flex items-center text-green-600 dark:text-green-400 font-medium mb-2">
          <CheckCircle className="h-5 w-5 mr-2" />
          Your Strengths
        </h4>
        <ul className="space-y-2">
          {strengths.map((strength, index) => (
            <li key={index} className="text-green-600 dark:text-green-400 text-sm flex items-start">
              <span className="mr-2">•</span>
              <span>{strength}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-red-500/10 dark:bg-red-500/5 p-4 rounded-lg border border-red-500/20">
        <h4 className="flex items-center text-red-600 dark:text-red-400 font-medium mb-2">
          <XCircle className="h-5 w-5 mr-2" />
          Areas to Improve
        </h4>
        <ul className="space-y-2">
          {weaknesses.map((weakness, index) => (
            <li key={index} className="text-red-600 dark:text-red-400 text-sm flex items-start">
              <span className="mr-2">•</span>
              <span>{weakness}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FeedbackSection;

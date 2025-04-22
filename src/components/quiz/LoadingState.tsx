
import { Loader2 } from 'lucide-react';

const LoadingState = () => {
  return (
    <div className="bg-card dark:bg-darkBlue-900/50 rounded-xl shadow-md overflow-hidden text-center p-10">
      <div className="flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
        <h3 className="text-xl font-semibold text-foreground">
          Analyzing your results with AI...
        </h3>
        <p className="text-muted-foreground">
          Our AI is generating personalized feedback based on your performance. This will take just a moment.
        </p>
      </div>
    </div>
  );
};

export default LoadingState;

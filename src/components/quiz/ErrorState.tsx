
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const ErrorState = () => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-card dark:bg-darkBlue-900/50 rounded-xl shadow-md overflow-hidden text-center p-10">
      <div className="flex flex-col items-center justify-center space-y-4">
        <XCircle className="h-12 w-12 text-destructive" />
        <h3 className="text-xl font-semibold text-foreground">
          Unable to generate feedback
        </h3>
        <p className="text-muted-foreground">
          We couldn't generate AI feedback at this time. Please try again later.
        </p>
        <Button 
          onClick={() => navigate('/topics')}
          className="bg-primary hover:bg-primary/90"
        >
          Back to Topics
        </Button>
      </div>
    </div>
  );
};

export default ErrorState;

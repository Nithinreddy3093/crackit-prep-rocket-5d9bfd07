
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const ActionButtons = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col sm:flex-row gap-3 p-4 bg-muted/50 border-t border-border">
      <Button
        onClick={() => navigate('/topics')}
        className="bg-primary hover:bg-primary/90"
      >
        Try Another Topic
      </Button>
      <Button
        variant="outline"
        onClick={() => navigate('/dashboard')}
        className="border-border text-primary hover:bg-primary/10"
      >
        View Your Dashboard
      </Button>
    </div>
  );
};

export default ActionButtons;


import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const AuthPrompt: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="mb-10 p-6 rounded-xl bg-darkBlue-900/30 border border-darkBlue-800">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Sign in to track your progress</h2>
          <p className="text-muted-foreground">Create an account to save your results and get personalized recommendations.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={() => navigate('/login')} className="bg-primary hover:bg-primary/90">
            Sign In
          </Button>
          <Button onClick={() => navigate('/signup')} variant="outline" className="border-border text-primary">
            Sign Up
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AuthPrompt;

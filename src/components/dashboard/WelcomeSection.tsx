
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

interface WelcomeSectionProps {
  userName: string;
}

const WelcomeSection: React.FC<WelcomeSectionProps> = ({ userName }) => {
  const navigate = useNavigate();

  const startStudySession = () => {
    toast({
      title: "Study Session Started",
      description: "Your focused study session has been initiated.",
      variant: "default",
    });
    // In a real app, this would redirect to a study session page or start a timer
    navigate('/topics');
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-darkBlue-900 to-darkBlue-800">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Welcome back, {userName}!
            </h1>
            <p className="text-xl text-blue-100">
              Track your progress, identify weaknesses, and improve your skills.
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-3">
            <Button 
              onClick={startStudySession}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              Start Study Session
            </Button>
            <Button 
              onClick={() => navigate('/resources')}
              variant="outline" 
              className="border-blue-400 text-blue-300 hover:bg-blue-900/30"
            >
              Browse Resources
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WelcomeSection;

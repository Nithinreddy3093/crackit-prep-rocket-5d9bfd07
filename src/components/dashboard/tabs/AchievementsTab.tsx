
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Certificates from '@/components/dashboard/Certificates';
import Badges from '@/components/dashboard/Badges';

// Mock certificates
const certificates = [
  { id: 1, name: 'Data Structures & Algorithms Proficiency', issueDate: '2025-03-20', score: '90%' },
  { id: 2, name: 'SQL & Database Management', issueDate: '2025-02-15', score: '85%' },
];

const AchievementsTab: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="glass-card p-6 hover:shadow-blue-500/10 dashboard-card-hover">
        <h3 className="section-title">
          <GraduationCap className="section-icon" />
          Your Certificates
        </h3>
        <Certificates certificates={certificates} />
      </div>
      <div className="glass-card p-6 hover:shadow-blue-500/10 dashboard-card-hover">
        <h3 className="section-title">
          <Trophy className="section-icon" />
          Your Badges
        </h3>
        <Badges />
        
        <div className="mt-8 text-center">
          <div className="inline-block p-6 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl border border-white/10">
            <h4 className="text-xl font-bold text-white mb-3">Ready for your next challenge?</h4>
            <p className="text-white/70 mb-4">Take a quiz to earn more badges and improve your skills!</p>
            <Button 
              onClick={() => navigate('/topics')}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
            >
              Explore Quiz Topics
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AchievementsTab;

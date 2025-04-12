
import React from 'react';
import { Code, Database, Cpu, Brain } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Badges: React.FC = () => {
  return (
    <Card className="bg-darkBlue-800 border-darkBlue-700">
      <CardHeader>
        <CardTitle className="text-xl text-white">Badges & Achievements</CardTitle>
        <CardDescription className="text-gray-400">
          Recognition of your accomplishments
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 py-2">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-3">
              <Code className="h-8 w-8 text-white" />
            </div>
            <p className="text-white text-sm font-medium">Algorithm Master</p>
            <p className="text-gray-400 text-xs mt-1">March 2025</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mb-3 opacity-60">
              <Database className="h-8 w-8 text-white" />
            </div>
            <p className="text-gray-400 text-sm font-medium">SQL Expert</p>
            <p className="text-gray-400 text-xs mt-1">In progress</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mb-3 opacity-60">
              <Cpu className="h-8 w-8 text-white" />
            </div>
            <p className="text-gray-400 text-sm font-medium">OS Specialist</p>
            <p className="text-gray-400 text-xs mt-1">In progress</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mb-3 opacity-60">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <p className="text-gray-400 text-sm font-medium">AI Apprentice</p>
            <p className="text-gray-400 text-xs mt-1">In progress</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Badges;

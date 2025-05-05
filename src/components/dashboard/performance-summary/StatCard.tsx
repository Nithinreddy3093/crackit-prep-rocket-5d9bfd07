
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { StatCardProps } from './types';

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, loading }) => {
  return (
    <div className="bg-darkBlue-700/50 rounded-xl p-4 flex flex-col">
      <div className="flex items-center mb-2">
        {icon}
        <span className="text-gray-300 text-sm">{title}</span>
      </div>
      {loading ? (
        <Skeleton className="h-8 w-16 bg-darkBlue-600" />
      ) : (
        <span className="text-2xl font-bold text-white">{value}</span>
      )}
    </div>
  );
};

export default StatCard;

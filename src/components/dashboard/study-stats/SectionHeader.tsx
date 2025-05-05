
import React, { ReactNode } from 'react';

interface SectionHeaderProps {
  icon: ReactNode;
  title: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ icon, title }) => {
  return (
    <div className="flex items-center mb-4">
      {icon}
      <h3 className="font-medium">{title}</h3>
    </div>
  );
};

export default SectionHeader;


import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

interface CompanyCardProps {
  name: string;
  logo: string;
  description: string;
  to: string;
}

const CompanyCard: React.FC<CompanyCardProps> = ({
  name,
  logo,
  description,
  to
}) => {
  return (
    <Link
      to={to}
      className="group flex flex-col h-full bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-border"
    >
      <div className="relative aspect-[4/1] bg-muted/50 flex items-center justify-center p-4 overflow-hidden">
        <img 
          src={logo} 
          alt={`${name} logo`} 
          className="max-w-[70%] max-h-[70%] object-contain" 
        />
        <div className="absolute top-2 right-2 bg-card rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <ArrowUpRight className="w-4 h-4 text-primary" />
        </div>
      </div>
      
      <div className="p-4 flex-grow">
        <h3 className="font-medium text-foreground">{name}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      
      <div className="px-4 pb-4 pt-2 border-t border-border">
        <div className="flex space-x-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
            Technical
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
            Aptitude
          </span>
        </div>
      </div>
    </Link>
  );
};

export default CompanyCard;

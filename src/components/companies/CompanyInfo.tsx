
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CompanyData {
  name: string;
  description: string;
  topics: string[];
  process: string[];
  requirements: string[];
}

const companyData: Record<string, CompanyData> = {
  infosys: {
    name: 'Infosys',
    description: 'Infosys is a global leader in next-generation digital services and consulting, enabling clients in 46 countries to navigate their digital transformation.',
    topics: [
      'Data Structures & Algorithms',
      'SQL & Database Management',
      'Operating Systems',
      'Computer Networks',
      'Programming Fundamentals (Java/Python)',
      'Aptitude & Logical Reasoning'
    ],
    process: [
      'Online Assessment',
      'Technical Interview',
      'HR Interview'
    ],
    requirements: [
      '60% or above in X, XII, and Graduation',
      'No active backlogs',
      'Strong problem-solving skills',
      'Good communication skills'
    ]
  }
};

const CompanyInfo = ({ companyName }: { companyName?: string }) => {
  if (!companyName || !companyData[companyName]) {
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-8">Company Not Found</h1>
        <p className="text-muted-foreground">
          The requested company information is not available.
        </p>
      </div>
    );
  }

  const company = companyData[companyName];

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-6">{company.name}</h1>
      <p className="text-lg text-muted-foreground mb-12">
        {company.description}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold mb-4">Important Topics</h2>
          <ul className="space-y-3">
            {company.topics.map((topic, index) => (
              <li key={index} className="flex items-center gap-2">
                <ArrowRight className="h-4 w-4 text-primary" />
                {topic}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-semibold mb-4">Selection Process</h2>
          <div className="space-y-4">
            {company.process.map((step, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
                  {index + 1}
                </div>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-muted/20 rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Eligibility Requirements</h2>
        <ul className="space-y-3">
          {company.requirements.map((req, index) => (
            <li key={index} className="flex items-center gap-2">
              <ArrowRight className="h-4 w-4 text-primary" />
              {req}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex gap-4">
        <Button>Start Practicing</Button>
        <Button variant="outline">View Resources</Button>
      </div>
    </div>
  );
};

export default CompanyInfo;


import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

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
  },
  tcs: {
    name: 'Tata Consultancy Services (TCS)',
    description: 'TCS is an Indian multinational information technology services and consulting company headquartered in Mumbai, offering a wide range of software and IT solutions globally.',
    topics: [
      'Quantitative Aptitude',
      'Programming Logic',
      'Data Structures',
      'Core Computer Science Concepts',
      'SQL & Database',
      'Verbal Ability'
    ],
    process: [
      'National Qualifier Test (NQT)',
      'Technical Interview',
      'Managerial Round',
      'HR Interview'
    ],
    requirements: [
      'Minimum 60% in X, XII, and Graduation',
      'All backlogs cleared',
      'Good analytical skills',
      'Strong communication skills'
    ]
  },
  wipro: {
    name: 'Wipro',
    description: 'Wipro is a leading global information technology, consulting and business process services company, delivering solutions to enable clients to do business better.',
    topics: [
      'Quantitative Aptitude',
      'Logical Reasoning',
      'Verbal Ability',
      'Data Structures & Algorithms',
      'Computer Programming',
      'Technical Fundamentals'
    ],
    process: [
      'Online Assessment',
      'Technical Round',
      'HR Interview'
    ],
    requirements: [
      'Minimum 60% throughout academics',
      'Maximum 1 year gap in education',
      'Problem-solving skills',
      'Adaptability and teamwork'
    ]
  },
  accenture: {
    name: 'Accenture',
    description: 'Accenture is a global professional services company with leading capabilities in digital, cloud and security, serving clients in more than 120 countries.',
    topics: [
      'Communication Skills',
      'Analytical Ability',
      'Attention to Detail',
      'Programming Fundamentals',
      'SQL & Database Concepts',
      'Logical Reasoning'
    ],
    process: [
      'Cognitive & Technical Assessment',
      'Coding Round',
      'Communication Assessment',
      'HR Interview'
    ],
    requirements: [
      '60% or above in academics',
      'Good communication skills',
      'Willingness to relocate',
      'Ability to work in teams'
    ]
  },
  cognizant: {
    name: 'Cognizant',
    description: 'Cognizant is an American multinational information technology services and consulting company that provides business consulting, IT and outsourcing services.',
    topics: [
      'Analytical Reasoning',
      'Quantitative Aptitude',
      'Computer Programming',
      'Data Structures',
      'DBMS & SQL',
      'OOPS Concepts'
    ],
    process: [
      'Online Aptitude Test',
      'Coding Assessment',
      'Technical Interview',
      'HR Interview'
    ],
    requirements: [
      'Minimum 60% in X, XII, and Graduation',
      'No standing backlogs',
      'Good problem-solving ability',
      'Effective communication skills'
    ]
  }
};

const CompanyInfo = ({ companyName }: { companyName?: string }) => {
  const navigate = useNavigate();
  
  if (!companyName || !companyData[companyName]) {
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-8">Company Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The requested company information is not available.
        </p>
        <Button onClick={() => navigate('/')} className="bg-primary text-white">
          Return to Home
        </Button>
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
        <Button onClick={() => navigate('/quiz')}>Start Practicing</Button>
        <Button variant="outline" onClick={() => navigate('/resources')}>View Resources</Button>
      </div>
    </div>
  );
};

export default CompanyInfo;

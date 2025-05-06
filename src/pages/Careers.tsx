
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Briefcase, MapPin, Clock, Users, LucideBriefcase, Trophy, Heart, Zap } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface JobPosition {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  posted: string;
}

const jobPositions: JobPosition[] = [
  {
    id: 'eng-001',
    title: 'Senior Frontend Engineer',
    department: 'Engineering',
    location: 'San Francisco, CA (Hybrid)',
    type: 'Full-time',
    posted: '3 days ago'
  },
  {
    id: 'eng-002',
    title: 'Backend Developer',
    department: 'Engineering',
    location: 'Remote (US)',
    type: 'Full-time',
    posted: '1 week ago'
  },
  {
    id: 'content-001',
    title: 'Technical Content Writer',
    department: 'Content',
    location: 'Remote (Worldwide)',
    type: 'Contract',
    posted: '2 days ago'
  },
  {
    id: 'des-001',
    title: 'UI/UX Designer',
    department: 'Design',
    location: 'New York, NY (On-site)',
    type: 'Full-time',
    posted: '5 days ago'
  },
  {
    id: 'marketing-001',
    title: 'Growth Marketing Manager',
    department: 'Marketing',
    location: 'Remote (US)',
    type: 'Full-time',
    posted: '1 day ago'
  }
];

const Careers = () => {
  const handleApply = (position: JobPosition) => {
    toast({
      title: "Application Started",
      description: `You're applying for ${position.title}. Application form will open in a new tab.`,
      variant: "default",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-darkBlue-900 via-darkBlue-800 to-darkBlue-700">
      <Navbar />
      
      <main className="container max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Join Our Team</h1>
          <p className="text-blue-200 max-w-2xl mx-auto">
            Help us revolutionize technical education and empower the next generation of engineers.
            We're looking for passionate individuals to join our mission.
          </p>
        </div>
        
        {/* Values Section */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Our Values</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ValueCard 
              icon={<Zap className="h-8 w-8 text-primary" />}
              title="Innovation"
              description="We constantly push boundaries in education technology to create better learning experiences."
            />
            <ValueCard 
              icon={<Users className="h-8 w-8 text-primary" />}
              title="Collaboration"
              description="We believe in the power of teamwork and diverse perspectives to solve complex problems."
            />
            <ValueCard 
              icon={<Trophy className="h-8 w-8 text-primary" />}
              title="Excellence"
              description="We pursue excellence in everything we do, from product quality to user experience."
            />
            <ValueCard 
              icon={<Heart className="h-8 w-8 text-primary" />}
              title="Empathy"
              description="We put our users first, understanding their challenges and designing for their needs."
            />
          </div>
        </div>
        
        {/* Benefits Section */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Why Work With Us</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-darkBlue-800/50 backdrop-blur-sm border border-darkBlue-700 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Flexible Work</h3>
              <ul className="space-y-3">
                <BenefitItem text="Remote-first culture" />
                <BenefitItem text="Flexible working hours" />
                <BenefitItem text="Quarterly team retreats" />
                <BenefitItem text="Home office stipend" />
              </ul>
            </div>
            
            <div className="bg-darkBlue-800/50 backdrop-blur-sm border border-darkBlue-700 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Growth & Learning</h3>
              <ul className="space-y-3">
                <BenefitItem text="Professional development budget" />
                <BenefitItem text="Mentorship programs" />
                <BenefitItem text="Conference attendance" />
                <BenefitItem text="Career advancement paths" />
              </ul>
            </div>
            
            <div className="bg-darkBlue-800/50 backdrop-blur-sm border border-darkBlue-700 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Comprehensive Benefits</h3>
              <ul className="space-y-3">
                <BenefitItem text="Competitive salary" />
                <BenefitItem text="Health, dental & vision insurance" />
                <BenefitItem text="401(k) matching" />
                <BenefitItem text="Generous PTO policy" />
              </ul>
            </div>
          </div>
        </div>
        
        {/* Open Positions */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Open Positions</h2>
          
          <div className="space-y-4">
            {jobPositions.map((position) => (
              <div 
                key={position.id}
                className="bg-darkBlue-800/50 backdrop-blur-sm border border-darkBlue-700 rounded-xl p-6 hover:border-primary/50 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center mb-2">
                      <LucideBriefcase className="h-5 w-5 text-primary mr-2" />
                      <span className="text-primary font-medium">{position.department}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">{position.title}</h3>
                    <div className="flex flex-col md:flex-row md:items-center text-sm text-gray-400 gap-2 md:gap-4">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {position.location}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {position.type}
                      </div>
                      <div>Posted {position.posted}</div>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => handleApply(position)}
                    className="whitespace-nowrap"
                  >
                    Apply Now
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <h3 className="text-xl font-bold text-white mb-4">Don't see a perfect fit?</h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              We're always looking for talented individuals to join our team. Send us your resume and let us know 
              how you can contribute to our mission.
            </p>
            <Button variant="outline" size="lg" className="border-primary/50 text-primary hover:bg-primary/10">
              Submit Open Application
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

interface ValueCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const ValueCard: React.FC<ValueCardProps> = ({ icon, title, description }) => {
  return (
    <div className="bg-darkBlue-800/50 backdrop-blur-sm border border-darkBlue-700 rounded-xl p-6 text-center hover:border-primary/30 transition-all">
      <div className="bg-primary/10 p-4 rounded-full inline-flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  );
};

interface BenefitItemProps {
  text: string;
}

const BenefitItem: React.FC<BenefitItemProps> = ({ text }) => {
  return (
    <li className="flex items-center text-gray-300">
      <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
      {text}
    </li>
  );
};

export default Careers;

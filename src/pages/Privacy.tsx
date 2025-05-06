
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowRight, Shield, Lock, Eye, FileCheck, UserCheck } from 'lucide-react';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-darkBlue-900 via-darkBlue-800 to-darkBlue-700">
      <Navbar />
      
      <main className="container max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-blue-200">Last updated: May 6, 2025</p>
        </div>
        
        <div className="bg-darkBlue-800/50 backdrop-blur-sm border border-darkBlue-700 rounded-xl p-6 md:p-8 mb-10">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
            <div className="bg-primary/10 p-4 rounded-full">
              <Shield className="h-10 w-10 text-primary" />
            </div>
            
            <div>
              <h2 className="text-xl font-bold text-white mb-2">Your Privacy Matters</h2>
              <p className="text-gray-300 mb-4">
                At TechPrep, we take your privacy very seriously. This Privacy Policy outlines how we collect, use, 
                disclose, and safeguard your information when you use our platform. Please read this policy carefully 
                to understand our practices regarding your personal data.
              </p>
              <p className="text-gray-300">
                By using our services, you agree to the terms outlined in this Privacy Policy. If you do not agree with these terms,
                please discontinue use of our platform immediately.
              </p>
            </div>
          </div>
          
          <div className="space-y-8">
            <Section 
              icon={<Eye className="h-6 w-6 text-primary" />}
              title="Information We Collect"
            >
              <p className="mb-4">We collect several types of information for various purposes to provide and improve our services to you:</p>
              
              <h4 className="text-md font-semibold text-white mb-2">Personal Data</h4>
              <ul className="list-disc pl-6 mb-4 space-y-1 text-gray-300">
                <li>Identity Information (name, email address)</li>
                <li>Account Credentials (username, password)</li>
                <li>Profile Information (academic background, professional goals)</li>
                <li>Usage Data (quiz results, learning progress)</li>
              </ul>
              
              <h4 className="text-md font-semibold text-white mb-2">Technical Data</h4>
              <ul className="list-disc pl-6 space-y-1 text-gray-300">
                <li>IP Address and geographic location</li>
                <li>Browser type and version</li>
                <li>Device information</li>
                <li>Cookies and usage statistics</li>
              </ul>
            </Section>
            
            <Section 
              icon={<FileCheck className="h-6 w-6 text-primary" />}
              title="How We Use Your Information"
            >
              <p className="mb-4">We use the collected data for various purposes:</p>
              
              <ul className="list-disc pl-6 space-y-2 text-gray-300">
                <li>To provide and maintain our service</li>
                <li>To notify you about changes to our service</li>
                <li>To provide user support</li>
                <li>To personalize your learning experience</li>
                <li>To analyze usage patterns and improve our platform</li>
                <li>To detect, prevent, and address technical or security issues</li>
              </ul>
            </Section>
            
            <Section 
              icon={<Lock className="h-6 w-6 text-primary" />}
              title="Data Security"
            >
              <p className="mb-4">
                The security of your data is important to us. We implement appropriate security measures to protect against 
                unauthorized access, alteration, disclosure, or destruction of your personal information.
              </p>
              
              <p className="mb-4">Our security practices include:</p>
              
              <ul className="list-disc pl-6 space-y-2 text-gray-300">
                <li>Encrypting sensitive data using industry-standard techniques</li>
                <li>Regular security assessments and penetration testing</li>
                <li>Secure authentication mechanisms</li>
                <li>Limited employee access to personal information</li>
                <li>Regular backups to prevent data loss</li>
              </ul>
            </Section>
            
            <Section 
              icon={<UserCheck className="h-6 w-6 text-primary" />}
              title="Your Data Rights"
            >
              <p className="mb-4">Under applicable data protection laws, you may have certain rights regarding your personal data:</p>
              
              <ul className="list-disc pl-6 space-y-2 text-gray-300">
                <li>The right to access the personal data we hold about you</li>
                <li>The right to request correction of your personal data</li>
                <li>The right to request deletion of your personal data</li>
                <li>The right to restrict processing of your personal data</li>
                <li>The right to data portability</li>
                <li>The right to object to processing of your personal data</li>
              </ul>
              
              <p className="mt-4 text-gray-300">
                To exercise these rights, please contact us using the information provided in the "Contact Us" section below.
              </p>
            </Section>
          </div>
          
          <div className="mt-12 border-t border-darkBlue-700 pt-8">
            <h3 className="text-xl font-bold text-white mb-4">Contact Us</h3>
            <p className="text-gray-300 mb-6">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            
            <div className="bg-darkBlue-700/50 rounded-lg p-5">
              <p className="text-white font-medium">TechPrep Privacy Team</p>
              <p className="text-gray-400 mt-1">Email: privacy@techprep.edu</p>
              <p className="text-gray-400">Address: 123 Tech Avenue, San Francisco, CA 94105, USA</p>
            </div>
            
            <div className="mt-8 text-gray-400 text-sm">
              <p>
                This Privacy Policy may change from time to time. We will not reduce your rights under this Privacy Policy without your explicit consent.
                We will post any privacy policy changes on this page and notify you of significant changes via email or through a notification on our platform.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

interface SectionProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ icon, title, children }) => {
  return (
    <div className="border-t border-darkBlue-700 pt-6">
      <div className="flex items-center mb-4">
        <div className="bg-primary/10 p-2 rounded-md mr-3">
          {icon}
        </div>
        <h3 className="text-lg font-bold text-white">{title}</h3>
      </div>
      <div className="pl-3 text-gray-300">
        {children}
      </div>
    </div>
  );
};

export default Privacy;

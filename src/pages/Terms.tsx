
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Scale, FileText, AlertTriangle, DollarSign, HelpCircle } from 'lucide-react';

const Terms = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-darkBlue-900 via-darkBlue-800 to-darkBlue-700">
      <Navbar />
      
      <main className="container max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Terms of Service</h1>
          <p className="text-blue-200">Last updated: May 6, 2025</p>
        </div>
        
        <div className="bg-darkBlue-800/50 backdrop-blur-sm border border-darkBlue-700 rounded-xl p-6 md:p-8 mb-10">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
            <div className="bg-primary/10 p-4 rounded-full">
              <Scale className="h-10 w-10 text-primary" />
            </div>
            
            <div>
              <h2 className="text-xl font-bold text-white mb-2">Agreement to Terms</h2>
              <p className="text-gray-300 mb-4">
                These Terms of Service ("Terms") govern your use of the TechPrep website, platform, and services 
                (collectively referred to as the "Service") operated by TechPrep Inc. ("us", "we", or "our").
              </p>
              <p className="text-gray-300">
                By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the terms,
                then you may not access the Service.
              </p>
            </div>
          </div>
          
          <div className="space-y-8">
            <Section 
              icon={<FileText className="h-6 w-6 text-primary" />}
              title="Use of Service"
            >
              <p className="mb-4">By using our service, you agree to the following:</p>
              
              <ul className="list-disc pl-6 space-y-2 text-gray-300">
                <li>You will create only one account and provide accurate information during registration</li>
                <li>You are responsible for maintaining the confidentiality of your account credentials</li>
                <li>You will not share your account with others or allow others to access the Service through your account</li>
                <li>You will not use the Service for any illegal purposes or in violation of any applicable laws</li>
                <li>You will not attempt to probe, scan, or test the vulnerability of the Service or any related system or network</li>
                <li>You will not interfere with the proper working of the Service</li>
                <li>You will comply with all applicable fair use policies and guidelines</li>
              </ul>
            </Section>
            
            <Section 
              icon={<AlertTriangle className="h-6 w-6 text-primary" />}
              title="Intellectual Property"
            >
              <p className="mb-4">
                The Service and its original content, features, and functionality are and will remain the exclusive property of 
                TechPrep Inc. and its licensors. The Service is protected by copyright, trademark, and other laws of both the 
                United States and foreign countries.
              </p>
              
              <p className="mb-4">You agree that:</p>
              
              <ul className="list-disc pl-6 space-y-2 text-gray-300">
                <li>All content provided through the Service is for personal educational use only</li>
                <li>You will not reproduce, distribute, modify, create derivative works of, publicly display, or use any content from the Service without written permission</li>
                <li>You will not use any TechPrep trademarks, service marks, or logos without our prior written consent</li>
                <li>Any feedback, ideas, or suggestions you provide may be used by us without any obligation to compensate you</li>
              </ul>
            </Section>
            
            <Section 
              icon={<DollarSign className="h-6 w-6 text-primary" />}
              title="Subscriptions and Payments"
            >
              <p className="mb-4">
                Some parts of the Service may be provided on a subscription basis. By subscribing to our premium services, you agree to the following:
              </p>
              
              <ul className="list-disc pl-6 space-y-2 text-gray-300">
                <li>You authorize us to charge your payment method for the subscription fees on a recurring basis</li>
                <li>Subscription periods may be monthly, quarterly, or annual, depending on the plan you select</li>
                <li>Subscriptions automatically renew unless you cancel at least 24 hours before the end of the current period</li>
                <li>Refunds are provided in accordance with our Refund Policy</li>
                <li>We reserve the right to change subscription prices upon notice to you</li>
                <li>Promotional or discounted subscriptions may convert to regular-priced subscriptions upon renewal</li>
              </ul>
              
              <p className="mt-4 text-gray-300">
                For full details on our subscription terms and refund policies, please refer to our Subscription Terms.
              </p>
            </Section>
            
            <Section 
              icon={<AlertTriangle className="h-6 w-6 text-primary" />}
              title="Limitation of Liability"
            >
              <p className="mb-4">
                To the maximum extent permitted by law, in no event shall TechPrep Inc., its directors, employees, partners, agents,
                suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including
                without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
              </p>
              
              <ul className="list-disc pl-6 space-y-2 text-gray-300">
                <li>Your access to or use of or inability to access or use the Service</li>
                <li>Any content obtained from the Service</li>
                <li>Unauthorized access, use, or alteration of your transmissions or content</li>
                <li>Any bugs, viruses, or the like that may be transmitted through the Service</li>
                <li>Any errors or omissions in any content or for any loss or damage incurred as a result of the use of any content posted, transmitted, or otherwise made available via the Service</li>
              </ul>
            </Section>
            
            <Section 
              icon={<HelpCircle className="h-6 w-6 text-primary" />}
              title="Changes to Terms"
            >
              <p className="mb-4">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any 
                significant changes through the Service or by sending you an email.
              </p>
              
              <p className="mb-4">
                What constitutes a material change will be determined at our sole discretion. By continuing to access or use our 
                Service after those revisions become effective, you agree to be bound by the revised terms. If you do not agree to 
                the new terms, please stop using the Service.
              </p>
            </Section>
          </div>
          
          <div className="mt-12 border-t border-darkBlue-700 pt-8">
            <h3 className="text-xl font-bold text-white mb-4">Contact Us</h3>
            <p className="text-gray-300 mb-6">
              If you have any questions about these Terms, please contact us at:
            </p>
            
            <div className="bg-darkBlue-700/50 rounded-lg p-5">
              <p className="text-white font-medium">TechPrep Legal Team</p>
              <p className="text-gray-400 mt-1">Email: legal@techprep.edu</p>
              <p className="text-gray-400">Address: 123 Tech Avenue, San Francisco, CA 94105, USA</p>
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

export default Terms;

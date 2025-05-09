
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Shield, CalendarDays } from 'lucide-react';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-darkBlue-900 via-darkBlue-800 to-darkBlue-700">
      <Navbar />
      <main className="container max-w-4xl mx-auto py-12 px-4">
        <div className="glass-card p-8 rounded-xl">
          <header className="mb-8 text-center">
            <div className="inline-flex p-3 rounded-full bg-primary/10 mb-4">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Privacy Policy</h1>
            <p className="text-blue-200">Last Updated: May 9, 2025</p>
          </header>

          <div className="space-y-6 text-white/80">
            <section>
              <h2 className="text-xl font-semibold text-white mb-2">1. Introduction</h2>
              <p>
                TechPrep ("we", "our," or "us") respects your privacy and is committed to protecting it through our compliance with this policy. This policy describes the types of information we may collect from you or that you may provide when you visit our website and our practices for collecting, using, maintaining, protecting, and disclosing that information.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-2">2. Information We Collect</h2>
              <p className="mb-2">We collect several types of information from and about users of our website, including:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Personal information such as name, email address, and other identifiers when you register for an account.</li>
                <li>Information about your internet connection, the equipment you use to access our website, and usage details.</li>
                <li>Records and copies of your correspondence if you contact us.</li>
                <li>Your quiz results, learning progress, and other performance metrics.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-2">3. How We Use Your Information</h2>
              <p className="mb-2">We use information that we collect about you or that you provide to us:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>To present our website and its contents to you.</li>
                <li>To provide you with information, products, or services that you request from us.</li>
                <li>To track and analyze your learning progress.</li>
                <li>To fulfill any other purpose for which you provide it.</li>
                <li>To carry out our obligations and enforce our rights.</li>
                <li>To notify you about changes to our website or any products or services we offer.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-2">4. Disclosure of Your Information</h2>
              <p className="mb-2">We may disclose aggregated information about our users without restriction. We may disclose personal information that we collect:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>To fulfill the purpose for which you provide it.</li>
                <li>To our subsidiaries and affiliates.</li>
                <li>To contractors, service providers, and other third parties we use to support our business.</li>
                <li>To comply with any court order, law, or legal process.</li>
                <li>To enforce our Terms of Service and other agreements.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-2">5. Data Security</h2>
              <p>
                We have implemented measures designed to secure your personal information from accidental loss and from unauthorized access, use, alteration, and disclosure. All information you provide to us is stored on secure servers behind firewalls. Any payment transactions will be encrypted using SSL technology.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-2">6. Your Rights</h2>
              <p>
                You have the right to access, correct, delete, or transfer your personal data. You may also withdraw consent for us to use your data for certain purposes. To exercise these rights, please contact us using the information provided below.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-2">7. Changes to Our Privacy Policy</h2>
              <p>
                We may update our Privacy Policy from time to time. If we make material changes, we will notify you by email or through a notice on our website prior to the change becoming effective. We encourage you to periodically review this page for the latest information on our privacy practices.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-2">8. Contact Information</h2>
              <p className="mb-4">
                If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:
              </p>
              <div className="bg-darkBlue-800/50 p-4 rounded-lg border border-darkBlue-700">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 mr-2 text-primary" />
                    <span className="text-white font-medium">TechPrep Privacy Team</span>
                  </div>
                  <div className="flex items-center">
                    <CalendarDays className="h-4 w-4 mr-2 text-primary" />
                    <span>Email: privacy@techprep.edu</span>
                  </div>
                  <div>
                    <span>Address: 123 Tech Avenue, San Francisco, CA 94105, USA</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="mt-8 pt-6 border-t border-darkBlue-700">
              <p className="text-sm text-white/60 text-center">
                By using our website, you acknowledge that you have read this Privacy Policy and understand our data practices.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;

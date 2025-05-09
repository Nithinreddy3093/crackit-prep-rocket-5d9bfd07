
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CalendarDays, Cookie, Shield, ShieldAlert } from 'lucide-react';

const CookiePolicy = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-darkBlue-900 via-darkBlue-800 to-darkBlue-700">
      <Navbar />
      <main className="flex-grow container max-w-4xl mx-auto py-12 px-4">
        <div className="glass-card p-8 rounded-xl">
          <header className="mb-8 text-center">
            <div className="inline-flex p-3 rounded-full bg-primary/10 mb-4">
              <Cookie className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Cookie Policy</h1>
            <p className="text-blue-200">Last Updated: May 9, 2025</p>
          </header>

          <div className="space-y-8 text-white/80">
            <section>
              <h2 className="text-xl font-semibold text-white mb-3">1. Introduction</h2>
              <p>
                This Cookie Policy explains how TechPrep ("we", "us", or "our") uses cookies and similar technologies 
                when you visit our website or use our services. This policy helps you understand what cookies are, 
                why we use them, and your choices regarding their use.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">2. What Are Cookies?</h2>
              <p>
                Cookies are small text files that are stored on your computer, tablet, mobile phone, or other device 
                when you visit a website. They are widely used to make websites work more efficiently, provide a better 
                user experience, and give website owners information about how their sites are being used.
              </p>
              <p className="mt-2">
                Other similar technologies, including web beacons, pixel tags, and local storage, may also be used for 
                these purposes. In this policy, we refer to all of these technologies as "cookies".
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">3. Types of Cookies We Use</h2>
              <div className="space-y-4 ml-4">
                <div>
                  <h3 className="font-medium text-white">Essential Cookies</h3>
                  <p>
                    These cookies are necessary for the website to function properly. They enable basic functions like 
                    page navigation, access to secure areas, and authentication. The website cannot function properly without these cookies.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-white">Preference Cookies</h3>
                  <p>
                    These cookies remember your settings and preferences so that you don't have to reset them each time you visit our site.
                    This includes your preferred language, region, login information, and theme preferences.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-white">Performance and Analytics Cookies</h3>
                  <p>
                    These cookies collect information about how you use our website, such as which pages you visit most frequently and if you 
                    encounter any errors. The data is aggregated and anonymized, and helps us improve how our website works.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-white">Functionality Cookies</h3>
                  <p>
                    These cookies allow the website to remember choices you make and provide enhanced, personalized features. For example, 
                    they may remember your quiz progress or learning path selections.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">4. Third-Party Cookies</h2>
              <p>
                Some cookies may be placed by third parties, such as analytics providers or social media platforms, 
                when you use our services. These third parties may receive information about your use of our website.
              </p>
              <p className="mt-2">
                We use the following third-party services that may place cookies on your device:
              </p>
              <ul className="list-disc ml-6 mt-2 space-y-2">
                <li>Google Analytics (for website usage analysis)</li>
                <li>Supabase (for authentication and database services)</li>
                <li>Stripe (for payment processing, when applicable)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">5. Cookie Management</h2>
              <p>
                You can control and manage cookies in various ways. Most web browsers allow you to manage your cookie 
                preferences through their settings. You can:
              </p>
              <ul className="list-disc ml-6 mt-2 space-y-2">
                <li>Delete cookies from your device</li>
                <li>Block cookies by activating the setting on your browser that allows you to refuse all or some cookies</li>
                <li>Set your browser to notify you when you receive a cookie</li>
              </ul>
              <p className="mt-2">
                Please note that if you choose to block or delete cookies, you may not be able to access certain areas or features of our website, 
                and some services may not function properly.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">6. Changes to This Cookie Policy</h2>
              <p>
                We may update this Cookie Policy from time to time to reflect changes in technology, regulation, or our business practices. 
                Any changes will be posted on this page, and if the changes are significant, we will provide a more prominent notice.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">7. Contact Us</h2>
              <p>
                If you have any questions about our use of cookies, please contact us at:
              </p>
              <div className="mt-3 space-y-2">
                <div className="flex items-center">
                  <Shield className="h-4 w-4 mr-2 text-primary" />
                  <span>TechPrep Privacy Team</span>
                </div>
                <div className="flex items-center">
                  <CalendarDays className="h-4 w-4 mr-2 text-primary" />
                  <span>Email: privacy@techprep.edu</span>
                </div>
                <div className="flex items-center">
                  <ShieldAlert className="h-4 w-4 mr-2 text-primary" />
                  <span>Address: 123 Tech Avenue, San Francisco, CA 94105, USA</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CookiePolicy;

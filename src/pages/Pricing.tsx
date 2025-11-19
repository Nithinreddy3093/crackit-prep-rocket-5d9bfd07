
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, HelpCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Pricing = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Simple, Transparent Pricing</h1>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Choose the plan that fits your needs. All plans include core features.
            </p>
          </div>
          
          <div className="mt-12 space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {/* Free Plan */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden bg-white dark:bg-gray-800">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Free</h3>
                <p className="mt-4 flex items-baseline">
                  <span className="text-4xl font-extrabold text-gray-900 dark:text-white">₹0</span>
                  <span className="ml-1 text-sm font-medium text-gray-500 dark:text-gray-400">/month</span>
                </p>
                <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                  Perfect for students just getting started with technical interview prep.
                </p>
                
                <ul className="mt-6 space-y-4">
                  <li className="flex">
                    <CheckCircle2 className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">Access to 5 topics</span>
                  </li>
                  <li className="flex">
                    <CheckCircle2 className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">10 quizzes per month</span>
                  </li>
                  <li className="flex">
                    <CheckCircle2 className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">Basic AI feedback</span>
                  </li>
                  <li className="flex">
                    <CheckCircle2 className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">Limited recommendations</span>
                  </li>
                  <li className="flex">
                    <XCircle className="flex-shrink-0 h-5 w-5 text-gray-400" />
                    <span className="ml-3 text-sm text-gray-500 dark:text-gray-400">No company-specific quizzes</span>
                  </li>
                  <li className="flex">
                    <XCircle className="flex-shrink-0 h-5 w-5 text-gray-400" />
                    <span className="ml-3 text-sm text-gray-500 dark:text-gray-400">No progress tracking</span>
                  </li>
                  <li className="flex">
                    <XCircle className="flex-shrink-0 h-5 w-5 text-gray-400" />
                    <span className="ml-3 text-sm text-gray-500 dark:text-gray-400">No Crackit Journal</span>
                  </li>
                </ul>
              </div>
              
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-200 dark:border-gray-700">
                <Button asChild className="w-full bg-crackit-600 hover:bg-crackit-700">
                  <Link to="/signup">Get Started</Link>
                </Button>
              </div>
            </div>
            
            {/* Pro Plan */}
            <div className="border-2 border-crackit-500 dark:border-crackit-400 rounded-lg shadow-lg overflow-hidden bg-white dark:bg-gray-800 relative">
              <div className="absolute top-0 inset-x-0">
                <div className="h-2 bg-gradient-to-r from-crackit-500 to-crackit-400"></div>
              </div>
              
              <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                <div className="inline-flex rounded-full bg-crackit-600 py-1 px-3 text-xs font-semibold text-white shadow-sm">
                  Popular
                </div>
              </div>
              
              <div className="p-6 pt-8">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Pro</h3>
                <p className="mt-4 flex items-baseline">
                  <span className="text-4xl font-extrabold text-gray-900 dark:text-white">₹999</span>
                  <span className="ml-1 text-sm font-medium text-gray-500 dark:text-gray-400">/month</span>
                </p>
                <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                  For serious interview candidates preparing for specific roles.
                </p>
                
                <ul className="mt-6 space-y-4">
                  <li className="flex">
                    <CheckCircle2 className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">Access to all topics</span>
                  </li>
                  <li className="flex">
                    <CheckCircle2 className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">Unlimited quizzes</span>
                  </li>
                  <li className="flex">
                    <CheckCircle2 className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">Advanced AI feedback</span>
                  </li>
                  <li className="flex">
                    <CheckCircle2 className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">Full recommendations library</span>
                  </li>
                  <li className="flex">
                    <CheckCircle2 className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">All company-specific quizzes</span>
                  </li>
                  <li className="flex">
                    <CheckCircle2 className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">Detailed progress tracking</span>
                  </li>
                  <li className="flex">
                    <CheckCircle2 className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">Crackit Journal</span>
                  </li>
                </ul>
              </div>
              
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-200 dark:border-gray-700">
                <Button asChild className="w-full bg-crackit-600 hover:bg-crackit-700">
                  <Link to="/signup">Get Started</Link>
                </Button>
              </div>
            </div>
            
            {/* Team Plan */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden bg-white dark:bg-gray-800">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Teams</h3>
                <p className="mt-4 flex items-baseline">
                  <span className="text-4xl font-extrabold text-gray-900 dark:text-white">₹2,399</span>
                  <span className="ml-1 text-sm font-medium text-gray-500 dark:text-gray-400">/month</span>
                </p>
                <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                  For organizations training multiple engineers or students.
                </p>
                
                <ul className="mt-6 space-y-4">
                  <li className="flex">
                    <CheckCircle2 className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">Everything in Pro</span>
                  </li>
                  <li className="flex">
                    <CheckCircle2 className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">5 user accounts</span>
                  </li>
                  <li className="flex">
                    <CheckCircle2 className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">Team analytics dashboard</span>
                  </li>
                  <li className="flex">
                    <CheckCircle2 className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">Custom topic creation</span>
                  </li>
                  <li className="flex">
                    <CheckCircle2 className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">Custom branding</span>
                  </li>
                  <li className="flex">
                    <CheckCircle2 className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">Priority support</span>
                  </li>
                  <li className="flex">
                    <CheckCircle2 className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">Team Journal with insights</span>
                  </li>
                </ul>
              </div>
              
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-200 dark:border-gray-700">
                <Button asChild className="w-full bg-crackit-600 hover:bg-crackit-700">
                  <Link to="/contact">Contact Sales</Link>
                </Button>
              </div>
            </div>
          </div>
          
          {/* FAQ Section */}
          <div className="mt-20">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">Frequently Asked Questions</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <h3 className="flex items-center text-lg font-medium text-gray-900 dark:text-white mb-3">
                  <HelpCircle className="h-5 w-5 mr-2 text-crackit-500" />
                  Can I upgrade or downgrade my plan?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Yes, you can upgrade or downgrade your plan at any time. Changes will be applied at the start of your next billing cycle.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <h3 className="flex items-center text-lg font-medium text-gray-900 dark:text-white mb-3">
                  <HelpCircle className="h-5 w-5 mr-2 text-crackit-500" />
                  What payment methods do you accept?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  We accept all major credit cards, PayPal, and selected cryptocurrencies.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <h3 className="flex items-center text-lg font-medium text-gray-900 dark:text-white mb-3">
                  <HelpCircle className="h-5 w-5 mr-2 text-crackit-500" />
                  Do you offer a student discount?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Yes! Students with a valid .edu email address can get 50% off the Pro plan. Contact our support team to apply.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <h3 className="flex items-center text-lg font-medium text-gray-900 dark:text-white mb-3">
                  <HelpCircle className="h-5 w-5 mr-2 text-crackit-500" />
                  Is there a free trial for paid plans?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  We offer a 7-day free trial for our Pro plan. No credit card required until you decide to continue.
                </p>
              </div>
            </div>
          </div>
          
          {/* Enterprise CTA */}
          <div className="mt-20 bg-gradient-to-r from-crackit-700 to-crackit-600 rounded-2xl shadow-xl overflow-hidden">
            <div className="px-6 py-12 sm:px-12 lg:flex lg:items-center lg:py-16">
              <div className="lg:w-0 lg:flex-1">
                <h2 className="text-3xl font-extrabold tracking-tight text-white">
                  Need a custom solution?
                </h2>
                <p className="mt-4 max-w-3xl text-lg text-crackit-100">
                  For universities, bootcamps, and large enterprises, we offer custom solutions that scale to your needs.
                  Get in touch with our team to discuss your requirements.
                </p>
              </div>
              <div className="mt-8 lg:mt-0 lg:ml-8">
                <div className="sm:flex">
                  <Button asChild size="lg" className="bg-white text-crackit-700 hover:bg-gray-100">
                    <Link to="/enterprise">Learn About Enterprise</Link>
                  </Button>
                </div>
                <p className="mt-3 text-sm text-crackit-200">
                  Includes custom integrations, dedicated support, and more.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Pricing;


import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { MailIcon, PhoneIcon, MapPin, MessageSquare, CheckCircle } from 'lucide-react';

const Support = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      toast({
        title: "Message sent!",
        description: "We'll get back to you as soon as possible.",
        variant: "default",
      });
      setName('');
      setEmail('');
      setMessage('');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-darkBlue-900 via-darkBlue-800 to-darkBlue-700">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Contact Us</h1>
            <p className="text-blue-200 max-w-2xl mx-auto">
              Have questions or need assistance? Our support team is here to help.
              Reach out to us through any of the channels below.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
            <div className="lg:col-span-5">
              <Card className="bg-darkBlue-800/50 border-darkBlue-700 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-white mb-6">Contact Information</h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="bg-primary/10 p-2 rounded-full mr-4">
                        <MailIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium text-white">Email</h3>
                        <a href="mailto:contact@techprep.edu" className="text-blue-300 hover:text-blue-200 transition-colors">
                          contact@techprep.edu
                        </a>
                        <p className="text-sm text-white/60 mt-1">We aim to respond within 24 hours</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-primary/10 p-2 rounded-full mr-4">
                        <PhoneIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium text-white">Phone</h3>
                        <a href="tel:+14155552671" className="text-blue-300 hover:text-blue-200 transition-colors">
                          +1 (415) 555-2671
                        </a>
                        <p className="text-sm text-white/60 mt-1">Mon-Fri, 9am-5pm PST</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-primary/10 p-2 rounded-full mr-4">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium text-white">Office</h3>
                        <p className="text-blue-300">123 Tech Avenue, San Francisco, CA 94105, USA</p>
                        <p className="text-sm text-white/60 mt-1">By appointment only</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-primary/10 p-2 rounded-full mr-4">
                        <MessageSquare className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium text-white">Live Chat</h3>
                        <p className="text-blue-300">Available through our website</p>
                        <p className="text-sm text-white/60 mt-1">Typical response time: 5 minutes</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 pt-8 border-t border-darkBlue-700">
                    <h3 className="font-medium text-white mb-3">Privacy Inquiries</h3>
                    <div className="flex items-center">
                      <MailIcon className="h-4 w-4 text-primary mr-2" />
                      <a href="mailto:privacy@techprep.edu" className="text-blue-300 hover:text-blue-200 transition-colors">
                        privacy@techprep.edu
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-7">
              <Card className="bg-darkBlue-800/50 border-darkBlue-700 backdrop-blur-sm h-full">
                <CardContent className="p-6">
                  {isSubmitted ? (
                    <div className="h-full flex flex-col items-center justify-center text-center py-12">
                      <div className="bg-primary/10 p-4 rounded-full mb-4">
                        <CheckCircle className="h-8 w-8 text-primary" />
                      </div>
                      <h2 className="text-xl font-bold text-white mb-2">Message Sent!</h2>
                      <p className="text-blue-200 max-w-md">
                        Thank you for reaching out. We've received your message and will get back to you as soon as possible.
                      </p>
                      <Button
                        className="mt-6"
                        onClick={() => setIsSubmitted(false)}
                      >
                        Send Another Message
                      </Button>
                    </div>
                  ) : (
                    <>
                      <h2 className="text-xl font-bold text-white mb-6">Send Us a Message</h2>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-1">Name</label>
                          <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your name"
                            required
                            className="bg-darkBlue-700/50 border-darkBlue-600"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-1">Email</label>
                          <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your.email@example.com"
                            required
                            className="bg-darkBlue-700/50 border-darkBlue-600"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="message" className="block text-sm font-medium text-white/80 mb-1">Message</label>
                          <Textarea
                            id="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="How can we help you?"
                            required
                            className="bg-darkBlue-700/50 border-darkBlue-600 min-h-[150px]"
                          />
                        </div>
                        
                        <Button
                          type="submit"
                          className="w-full"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? 'Sending...' : 'Send Message'}
                        </Button>
                      </form>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="mt-12">
            <h2 className="text-xl font-bold text-white mb-6 text-center">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-darkBlue-800/50 border-darkBlue-700 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-white mb-2">How do I reset my password?</h3>
                  <p className="text-blue-200">
                    Click on "Forgot Password" on the login page, enter your email, and follow the instructions sent to your inbox.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-darkBlue-800/50 border-darkBlue-700 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-white mb-2">How can I access study materials?</h3>
                  <p className="text-blue-200">
                    All study materials are available in the Resources section after logging in to your account.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-darkBlue-800/50 border-darkBlue-700 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-white mb-2">Do you offer refunds?</h3>
                  <p className="text-blue-200">
                    Yes, we offer a 30-day money-back guarantee for all of our subscription plans.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-darkBlue-800/50 border-darkBlue-700 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-white mb-2">How often is content updated?</h3>
                  <p className="text-blue-200">
                    Our team updates content weekly to ensure all materials reflect the latest industry standards and interview practices.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Support;

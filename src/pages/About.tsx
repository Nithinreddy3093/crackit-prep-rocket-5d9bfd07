import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Brain, Target, BookOpen, LineChart, CheckCircle, Users, Award, Github } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-background to-accent/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">About Crackit</h1>
            <p className="text-xl max-w-3xl mx-auto text-muted-foreground">
              We're on a mission to help students and professionals ace technical interviews
              through personalized learning and focused practice.
            </p>
          </div>
        </section>
        
        {/* Our Story */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Our Story</h2>
              <div className="mt-6 max-w-3xl mx-auto text-gray-600 dark:text-gray-300">
                <p className="mb-4">
                  Crackit was born out of frustration. As students preparing for technical interviews,
                  we spent endless hours sifting through disconnected resources, never quite sure if we
                  were focusing on the right topics.
                </p>
                <p className="mb-4">
                  We realized that while there's no shortage of content, what's missing is personalized
                  guidance — something that could tell you exactly what to learn next based on your unique
                  strengths and weaknesses.
                </p>
                <p>
                  So we built Crackit — an AI-powered platform that tests your knowledge,
                  identifies your gaps, and gives you focused recommendations to improve faster than
                  ever before.
                </p>
              </div>
            </div>
            
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                <div className="w-16 h-16 mx-auto bg-crackit-100 dark:bg-crackit-900 rounded-full flex items-center justify-center text-crackit-600 dark:text-crackit-400 mb-4">
                  <Brain className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">AI-Powered</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Our platform uses advanced algorithms to analyze your performance and provide personalized feedback
                  tailored to your unique learning profile.
                </p>
              </div>
              
              <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                <div className="w-16 h-16 mx-auto bg-crackit-100 dark:bg-crackit-900 rounded-full flex items-center justify-center text-crackit-600 dark:text-crackit-400 mb-4">
                  <Target className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Targeted Learning</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Rather than overwhelming you with information, we focus your attention on exactly what
                  you need to know to improve quickly.
                </p>
              </div>
              
              <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                <div className="w-16 h-16 mx-auto bg-crackit-100 dark:bg-crackit-900 rounded-full flex items-center justify-center text-crackit-600 dark:text-crackit-400 mb-4">
                  <LineChart className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Progress Tracking</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  We help you stay motivated by showing your improvement over time through detailed
                  analytics and progress tracking.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Updated About Crackit Section */}
        <section className="py-16 bg-gradient-to-br from-background to-accent/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-foreground mb-8">About Crackit</h2>
              <p className="text-lg text-muted-foreground mb-8">
                We're on a mission to help students and professionals ace technical interviews
                through personalized learning and focused practice.
              </p>
              
              <div className="space-y-6 text-left bg-card p-6 rounded-lg shadow-sm">
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-foreground">👨‍💻 Founder</h3>
                  <p className="text-muted-foreground">Marthala Nithin Reddy</p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-foreground">📞 Contact</h3>
                  <p className="text-muted-foreground">📱 Phone: +91 7093569420</p>
                  <p className="text-muted-foreground">
                    📧 Email: {' '}
                    <a 
                      href="mailto:marthalanithinreddy3093@gmail.com" 
                      className="text-primary hover:underline"
                    >
                      marthalanithinreddy3093@gmail.com
                    </a>
                  </p>
                  <p className="text-muted-foreground">
                    🔗 LinkedIn: {' '}
                    <a 
                      href="https://linkedin.com/in/nithin-marthala" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      linkedin.com/in/nithin-marthala
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* How It Works */}
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">How It Works</h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Our approach combines targeted assessment with personalized learning paths
              </p>
            </div>
            
            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-4">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm relative">
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-crackit-600 rounded-full flex items-center justify-center text-white font-bold">1</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Take a Quick Test</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Choose a topic or company and take a 10-15 question test focused on key concepts.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm relative">
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-crackit-600 rounded-full flex items-center justify-center text-white font-bold">2</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Get Detailed Feedback</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Receive AI-powered analysis of your performance, showing strengths and weak areas.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm relative">
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-crackit-600 rounded-full flex items-center justify-center text-white font-bold">3</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Get Recommendations</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Receive personalized learning materials targeted specifically to your weak spots.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm relative">
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-crackit-600 rounded-full flex items-center justify-center text-white font-bold">4</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Track Your Progress</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Take weekly re-tests to measure improvements and watch your progress grow over time.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Team Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Meet Our Team</h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                We're a team of engineers, educators, and AI specialists passionate about improving technical education
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                <div className="aspect-w-4 aspect-h-3 bg-gray-200 dark:bg-gray-700">
                  <img src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" alt="Team member" className="object-cover" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Alex Parker</h3>
                  <p className="text-crackit-600 dark:text-crackit-400">Founder & CEO</p>
                  <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm">
                    Former software engineer at Google with a passion for making technical concepts accessible to everyone.
                  </p>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                <div className="aspect-w-4 aspect-h-3 bg-gray-200 dark:bg-gray-700">
                  <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80" alt="Team member" className="object-cover" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Sophia Chen</h3>
                  <p className="text-crackit-600 dark:text-crackit-400">CTO</p>
                  <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm">
                    AI researcher with a PhD in machine learning, focused on building adaptive learning systems.
                  </p>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                <div className="aspect-w-4 aspect-h-3 bg-gray-200 dark:bg-gray-700">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" alt="Team member" className="object-cover" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Raj Mehta</h3>
                  <p className="text-crackit-600 dark:text-crackit-400">Head of Content</p>
                  <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm">
                    Former CS professor with 10+ years of experience preparing students for technical roles.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Testimonials */}
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">What Our Users Say</h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Thousands of students and professionals have improved their skills with Crackit
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 italic mb-4">
                  "Crackit helped me identify my weak areas in DSA and focus my studies. I ended up acing my Google interview!"
                </p>
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <img className="h-10 w-10 rounded-full" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Priya S.</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Software Engineer at Google</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 italic mb-4">
                  "I was struggling with SQL concepts, but after two weeks with Crackit's personalized recommendations, I saw huge improvements."
                </p>
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <img className="h-10 w-10 rounded-full" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Michael L.</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Data Analyst</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 italic mb-4">
                  "The company-specific quizzes helped me prepare for TCS interviews. The AI feedback was spot on!"
                </p>
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <img className="h-10 w-10 rounded-full" src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Arjun P.</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">CS Graduate</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-br from-crackit-900 to-crackit-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to improve your skills?</h2>
            <p className="text-xl text-crackit-100 mb-8 max-w-3xl mx-auto">
              Join thousands of students and professionals who are using Crackit to prepare smarter for technical interviews.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-crackit-700 hover:bg-gray-100">
                <Link to="/signup">Get Started for Free</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-crackit-800">
                <Link to="/topics">Explore Topics</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;

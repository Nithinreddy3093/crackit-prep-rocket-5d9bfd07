
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { BookOpen, Clock, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const blogPosts = [
  {
    title: "Master Data Structures for Technical Interviews",
    date: "April 15, 2025",
    readTime: "8 min read",
    description: "Learn the most important data structures that commonly appear in technical interviews.",
    category: "Technical Interview"
  },
  {
    title: "Top 10 System Design Interview Questions",
    date: "April 12, 2025",
    readTime: "10 min read",
    description: "Common system design questions asked at top tech companies and how to approach them.",
    category: "System Design"
  },
  {
    title: "Behavioral Interview Tips and Tricks",
    date: "April 10, 2025",
    readTime: "6 min read",
    description: "Master the art of behavioral interviews with proven strategies and examples.",
    category: "Soft Skills"
  }
];

const Blogs = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Interview Preparation Blog
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Expert insights, tips, and strategies to help you ace your next technical interview.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="text-sm text-muted-foreground mb-2">
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                      {post.category}
                    </span>
                  </div>
                  <CardTitle className="text-xl mb-2">{post.title}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{post.readTime}</span>
                    <span>•</span>
                    <span>{post.date}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    {post.description}
                  </p>
                  <Button variant="ghost" className="text-primary hover:text-primary/80">
                    Read More <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Blogs;

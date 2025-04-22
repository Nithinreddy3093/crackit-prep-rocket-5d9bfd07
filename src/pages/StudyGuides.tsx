
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { BookOpen, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const guides = [
  {
    title: "Data Structures and Algorithms",
    description: "A comprehensive guide covering all essential DSA topics for technical interviews.",
    topics: ["Arrays & Strings", "Linked Lists", "Trees & Graphs", "Dynamic Programming"],
    difficulty: "Intermediate"
  },
  {
    title: "System Design",
    description: "Learn how to design scalable systems and tackle system design interviews.",
    topics: ["Scalability", "Load Balancing", "Caching", "Database Design"],
    difficulty: "Advanced"
  },
  {
    title: "Object-Oriented Programming",
    description: "Master OOP concepts and design patterns for technical interviews.",
    topics: ["Classes & Objects", "Inheritance", "Polymorphism", "Design Patterns"],
    difficulty: "Intermediate"
  }
];

const StudyGuides = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Interview Study Guides
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive study materials to help you prepare for technical interviews.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guides.map((guide, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-center mb-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <span className={`text-sm px-2 py-1 rounded-full ${
                      guide.difficulty === 'Advanced' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {guide.difficulty}
                    </span>
                  </div>
                  <CardTitle className="text-xl">{guide.title}</CardTitle>
                  <CardDescription>{guide.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {guide.topics.map((topic, idx) => (
                      <div key={idx} className="flex items-center text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        {topic}
                      </div>
                    ))}
                  </div>
                  <Button className="w-full mt-4">Access Guide</Button>
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

export default StudyGuides;

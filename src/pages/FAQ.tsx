
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const faqs = [
  {
    question: "How do I prepare for technical interviews?",
    answer: "Start with understanding core concepts in data structures and algorithms. Practice coding problems regularly, learn system design concepts, and do mock interviews. Our platform provides structured learning paths and practice materials to help you prepare effectively."
  },
  {
    question: "What topics should I focus on?",
    answer: "Focus on fundamental data structures (arrays, linked lists, trees, graphs), algorithms (sorting, searching, dynamic programming), system design, and object-oriented programming. Also practice problem-solving and communication skills."
  },
  {
    question: "How long should I prepare for interviews?",
    answer: "The preparation time varies based on your experience and target companies. Generally, 2-3 months of dedicated preparation is recommended for experienced developers, while fresh graduates might need 4-6 months."
  },
  {
    question: "What makes Crackit different from other platforms?",
    answer: "Crackit offers personalized learning paths, AI-powered recommendations, company-specific practice questions, and detailed performance analytics. Our platform adapts to your learning pace and focuses on your weak areas."
  },
  {
    question: "How up-to-date are your questions?",
    answer: "Our questions are regularly updated based on recent interview experiences and industry trends. We collaborate with professionals from top tech companies to ensure our content remains relevant."
  }
];

const FAQ = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-muted-foreground">
              Find answers to common questions about interview preparation and our platform.
            </p>
          </div>
          
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-lg font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FAQ;

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Sparkles, ThumbsUp, ThumbsDown, Lightbulb, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const HR_QUESTIONS = [
  "Tell me about yourself and your background.",
  "Why do you want to work for this company?",
  "What are your greatest strengths and weaknesses?",
  "Describe a challenging situation you faced and how you handled it.",
  "Where do you see yourself in 5 years?",
  "Why should we hire you over other candidates?",
  "Tell me about a time you worked in a team.",
  "How do you handle stress and pressure?",
  "What motivates you in your work?",
  "Describe a time you had to deal with a difficult colleague."
];

interface Evaluation {
  score: number;
  strengths: string | string[];
  weaknesses: string | string[];
  suggestions: string | string[];
  improved_answer: string;
}

const HRInterview = () => {
  const { toast } = useToast();
  const [selectedQuestion, setSelectedQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [position, setPosition] = useState('Software Engineer');
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const handleEvaluate = async () => {
    if (!answer.trim()) {
      toast({
        title: 'Answer Required',
        description: 'Please write your answer before submitting',
        variant: 'destructive'
      });
      return;
    }

    setIsEvaluating(true);
    try {
      const { data, error } = await supabase.functions.invoke('evaluate-hr-answer', {
        body: { question: selectedQuestion, answer, position }
      });

      if (error) throw error;

      setEvaluation(data);
      toast({
        title: 'Answer Evaluated!',
        description: `Your score: ${data.score}/10`,
      });
    } catch (error) {
      console.error('Evaluation error:', error);
      toast({
        title: 'Evaluation Failed',
        description: 'Unable to evaluate your answer. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleNewQuestion = () => {
    setSelectedQuestion('');
    setAnswer('');
    setEvaluation(null);
  };

  const renderListItems = (items: string | string[]) => {
    if (typeof items === 'string') {
      return <p className="text-muted-foreground">{items}</p>;
    }
    return (
      <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
        {items.map((item, idx) => <li key={idx}>{item}</li>)}
      </ul>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-darkBlue-900 via-darkBlue-800 to-darkBlue-700">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
        {/* Coming Soon Banner */}
        <div className="mb-8 p-6 bg-primary/10 border-2 border-primary/30 rounded-lg text-center">
          <h2 className="text-2xl font-bold text-primary mb-2">Coming Soon</h2>
          <p className="text-muted-foreground">
            HR Interview Practice is currently under development. Check back soon for this exciting feature!
          </p>
        </div>
        
        <div className="mb-8 text-center opacity-50 pointer-events-none">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
            <MessageSquare className="h-10 w-10 text-primary" />
            AI-Powered HR Interview Practice
          </h1>
          <p className="text-lg text-muted-foreground">
            Practice your interview skills with AI-powered feedback and evaluation
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Question Selection */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-foreground">Select a Question</CardTitle>
              <CardDescription className="text-muted-foreground">
                Choose from common HR interview questions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {HR_QUESTIONS.map((q, idx) => (
                <Button
                  key={idx}
                  variant={selectedQuestion === q ? 'default' : 'outline'}
                  className="w-full justify-start text-left h-auto py-3"
                  onClick={() => {
                    setSelectedQuestion(q);
                    setAnswer('');
                    setEvaluation(null);
                  }}
                >
                  <span className="font-semibold mr-2">{idx + 1}.</span>
                  {q}
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Answer Input */}
          <div className="space-y-6">
            {selectedQuestion ? (
              <>
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-foreground">Your Answer</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Question: {selectedQuestion}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Position (optional)
                      </label>
                      <input
                        type="text"
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
                        className="w-full px-3 py-2 bg-background/50 border border-border rounded-md text-foreground"
                        placeholder="e.g., Software Engineer"
                      />
                    </div>
                    <Textarea
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      placeholder="Type your answer here... Be detailed and specific."
                      className="min-h-[200px] bg-background/50"
                    />
                    <div className="flex gap-2">
                      <Button 
                        onClick={handleEvaluate}
                        disabled={isEvaluating || !answer.trim()}
                        className="flex-1"
                      >
                        <Sparkles className="mr-2 h-4 w-4" />
                        {isEvaluating ? 'Evaluating...' : 'Evaluate with AI'}
                      </Button>
                      <Button 
                        onClick={handleNewQuestion}
                        variant="outline"
                      >
                        New Question
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Evaluation Results */}
                {evaluation && (
                  <Card className="glass-card border-primary/50">
                    <CardHeader>
                      <CardTitle className="text-foreground flex items-center justify-between">
                        <span>AI Evaluation</span>
                        <Badge variant={evaluation.score >= 7 ? 'default' : 'secondary'} className="text-lg px-4 py-1">
                          {evaluation.score}/10
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                        <h3 className="font-semibold text-foreground flex items-center gap-2 mb-2">
                          <ThumbsUp className="h-5 w-5 text-green-400" />
                          Strengths
                        </h3>
                        {renderListItems(evaluation.strengths)}
                      </div>

                      <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                        <h3 className="font-semibold text-foreground flex items-center gap-2 mb-2">
                          <ThumbsDown className="h-5 w-5 text-orange-400" />
                          Areas for Improvement
                        </h3>
                        {renderListItems(evaluation.weaknesses)}
                      </div>

                      <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                        <h3 className="font-semibold text-foreground flex items-center gap-2 mb-2">
                          <Lightbulb className="h-5 w-5 text-blue-400" />
                          Suggestions
                        </h3>
                        {renderListItems(evaluation.suggestions)}
                      </div>

                      <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                        <h3 className="font-semibold text-foreground flex items-center gap-2 mb-2">
                          <TrendingUp className="h-5 w-5 text-primary" />
                          Improved Answer Example
                        </h3>
                        <p className="text-muted-foreground whitespace-pre-wrap">
                          {evaluation.improved_answer}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <Card className="glass-card">
                <CardContent className="py-12 text-center">
                  <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground text-lg">
                    Select a question from the left to get started
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HRInterview;
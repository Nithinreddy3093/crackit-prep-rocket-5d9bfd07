
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle, Timer } from 'lucide-react';
import { cn } from "@/lib/utils";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getQuestionsByTopicId } from "@/services/questionService";
import { getTopicById } from "@/services/topicService";
import { updateUserPerformance } from "@/services/supabasePerformanceService";

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
}

const Quiz = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentTopic, setCurrentTopic] = useState<any | null>(null);

  // Fetch questions using react-query
  const { isLoading: isQuestionsLoading, error: questionsError } = useQuery({
    queryKey: ['questions', topicId],
    queryFn: () => getQuestionsByTopicId(topicId),
    enabled: !!topicId, // Ensure topicId is available before running the query
    meta: {
      onSuccess: (data: Question[]) => {
        setQuestions(data);
      },
      onError: (error: any) => {
        toast({
          title: "Error fetching questions",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  });

  // Fetch topic details
  const { isLoading: isTopicLoading, error: topicError } = useQuery({
    queryKey: ['topic', topicId],
    queryFn: () => getTopicById(topicId),
    enabled: !!topicId, // Ensure topicId is available before running the query
    meta: {
      onSuccess: (data: any) => {
        setCurrentTopic(data);
      },
      onError: (error: any) => {
        toast({
          title: "Error fetching topic",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  });

  // Add effect hooks to manage question data and timers
  useEffect(() => {
    // When questions are loaded from the query, set them to state
    if (isQuestionsLoading === false && !questionsError && questions.length === 0) {
      getQuestionsByTopicId(topicId).then(data => {
        setQuestions(data);
      }).catch(error => {
        console.error('Error fetching questions:', error);
      });
    }
  }, [isQuestionsLoading, questionsError, topicId, questions.length]);

  useEffect(() => {
    // When topic is loaded from the query, set it to state
    if (isTopicLoading === false && !topicError && !currentTopic) {
      getTopicById(topicId).then(data => {
        setCurrentTopic(data);
      }).catch(error => {
        console.error('Error fetching topic:', error);
      });
    }
  }, [isTopicLoading, topicError, topicId, currentTopic]);

  useEffect(() => {
    if (questions.length > 0) {
      setStartTime(Date.now());
    }
  }, [questions.length]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (startTime > 0 && !quizCompleted) {
      intervalId = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [startTime, quizCompleted]);

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const goToNextQuestion = () => {
    if (!selectedAnswer) {
      toast({
        title: "Please select an answer",
        description: "You must select an answer before proceeding.",
        variant: "destructive",
      });
      return;
    }

    const currentQuestion = questions[currentQuestionIndex];
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setCorrectAnswers(correctAnswers + 1);
    }

    setSelectedAnswer(null); // Reset selected answer

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setCorrectAnswers(0);
    setQuizCompleted(false);
    setStartTime(Date.now());
    setElapsedTime(0);
  };

  const handleSubmitQuiz = async () => {
    try {
      if (user) {
        const quizTopic = currentTopic?.title || 'General';
        const quizScore = Math.round((correctAnswers / questions.length) * 100);
        const completionTime = Math.floor((Date.now() - startTime) / 1000); // in seconds
        
        // Update the user's performance in Supabase
        await updateUserPerformance(user.id, quizTopic, quizScore, completionTime);
      }
      
      toast({
        title: "Quiz Submitted",
        description: "Your quiz has been submitted and your score has been recorded.",
        variant: "default",
      });
      navigate('/dashboard');
    } catch (error: any) {
      console.error("Error submitting quiz:", error);
      toast({
        title: "Error submitting quiz",
        description: error.message || "Failed to submit the quiz. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isQuestionsLoading || isTopicLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent animate-pulse-slow flex items-center justify-center">
        <div className="w-3 h-3 bg-white rounded-full"></div>
      </div>
    </div>;
  }

  if (questionsError || topicError) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-destructive mb-4">Error</h2>
        <p className="text-muted-foreground">
          {questionsError?.message || topicError?.message || "Failed to load quiz."}
        </p>
        <Button variant="outline" onClick={() => navigate('/topics')}>
          Go back to topics
        </Button>
      </div>
    </div>;
  }

  if (quizCompleted) {
    const score = Math.round((correctAnswers / questions.length) * 100);

    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-darkBlue-900 via-darkBlue-800 to-darkBlue-700">
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-darkBlue-800 border-darkBlue-700">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-white">Quiz Completed!</CardTitle>
              <CardDescription className="text-gray-400">Here are your results:</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white">Topic:</span>
                <span className="font-medium text-primary">{currentTopic?.title}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white">Time Taken:</span>
                <span className="font-medium text-primary">{formatTime(elapsedTime)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white">Your Score:</span>
                <span className="font-bold text-3xl text-primary">{score}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white">Correct Answers:</span>
                <span className="font-medium text-primary">{correctAnswers} / {questions.length}</span>
              </div>
            </CardContent>
            
            <div className="flex justify-between p-6">
              <Button variant="secondary" onClick={handleRestartQuiz}>
                Restart Quiz
              </Button>
              <Button onClick={handleSubmitQuiz}>
                Submit Quiz
              </Button>
            </div>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-darkBlue-900 via-darkBlue-800 to-darkBlue-700">
      <Navbar />
      <main className="flex-grow p-4">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-white">{currentTopic?.title} Quiz</h1>
            <div className="flex items-center text-gray-300">
              <Timer className="mr-2 h-4 w-4" />
              <span>{formatTime(elapsedTime)}</span>
            </div>
          </div>
          
          <Card className="bg-darkBlue-800 border-darkBlue-700">
            <CardHeader>
              <CardTitle className="text-xl text-white">
                Question {currentQuestionIndex + 1} / {questions.length}
              </CardTitle>
              <CardDescription className="text-gray-400">
                Answer the question below
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentQuestion && (
                <>
                  <p className="text-white text-lg">{currentQuestion.text}</p>
                  <RadioGroup defaultValue={selectedAnswer || ""} onValueChange={handleAnswerSelect} className="w-full">
                    {currentQuestion.options.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`answer-${option}`} className="peer h-4 w-4 shrink-0 rounded-full border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
                        <Label htmlFor={`answer-${option}`} className="cursor-pointer text-white peer-checked:text-primary">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </>
              )}
            </CardContent>
          </Card>
          
          <Button onClick={goToNextQuestion} className="w-full bg-primary hover:bg-primary/90 text-white">
            {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Quiz;

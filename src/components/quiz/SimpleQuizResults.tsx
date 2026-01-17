import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Trophy, Clock, Target, RotateCcw, Save } from 'lucide-react';
import { QuizAnswerDetail } from '@/hooks/useSimpleQuiz';
import { motion } from 'framer-motion';
import ConfettiEffect from '@/components/common/ConfettiEffect';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SimpleQuizResultsProps {
  correctAnswersCount: number;
  totalQuestions: number;
  scorePercentage: number;
  elapsedTime: number;
  formatTime: (ms: number) => string;
  topicTitle?: string;
  questionDetails: QuizAnswerDetail[];
  onRestart: () => void;
}

const SimpleQuizResults: React.FC<SimpleQuizResultsProps> = ({
  correctAnswersCount,
  totalQuestions,
  scorePercentage,
  elapsedTime,
  formatTime,
  topicTitle,
  questionDetails,
  onRestart
}) => {
  const navigate = useNavigate();
  const isPassed = scorePercentage >= 70;
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isPassed) {
      setShowConfetti(true);
    }
  }, [isPassed]);

  const handleViewDashboard = () => {
    navigate('/dashboard', { state: { quizCompleted: true } });
  };

  return (
    <>
      <ConfettiEffect active={showConfetti} onComplete={() => setShowConfetti(false)} />
      
      <motion.div 
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="glass-card-strong">
        <CardHeader className="text-center">
          <motion.div 
            className="flex justify-center mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: 360 }}
            transition={{ duration: 0.6, type: 'spring' }}
          >
            {isPassed ? (
              <Trophy className="h-16 w-16 text-yellow-500 drop-shadow-glow" />
            ) : (
              <Target className="h-16 w-16 text-blue-500" />
            )}
          </motion.div>
          <CardTitle className="text-2xl font-bold text-white mb-2">
            Quiz Complete!
          </CardTitle>
          <p className="text-white/80">
            You completed the {topicTitle} quiz
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Results Saved Indicator */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Alert className="bg-green-500/20 border-green-500/30">
              <Save className="h-4 w-4 text-green-400" />
              <AlertDescription className="text-green-400 ml-2">
                Your quiz results have been saved successfully!
              </AlertDescription>
            </Alert>
          </motion.div>

          {/* Score Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <div className="text-3xl font-bold text-white mb-1">
                {correctAnswersCount}/{totalQuestions}
              </div>
              <p className="text-white/60 text-sm">Correct Answers</p>
            </div>
            
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <div className={`text-3xl font-bold mb-1 ${
                isPassed ? 'text-green-400' : 'text-orange-400'
              }`}>
                {scorePercentage}%
              </div>
              <p className="text-white/60 text-sm">Score</p>
            </div>
            
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <div className="text-3xl font-bold text-white mb-1 flex items-center justify-center">
                <Clock className="h-6 w-6 mr-2" />
                {formatTime(elapsedTime)}
              </div>
              <p className="text-white/60 text-sm">Time Taken</p>
            </div>
          </div>

          {/* Performance Message */}
          <div className={`p-4 rounded-lg ${
            isPassed ? 'bg-green-500/20 border border-green-500/30' : 'bg-orange-500/20 border border-orange-500/30'
          }`}>
            <div className="text-center">
              <h3 className={`text-lg font-semibold mb-2 ${
                isPassed ? 'text-green-400' : 'text-orange-400'
              }`}>
                {isPassed ? '🎉 Congratulations!' : '💪 Keep Learning!'}
              </h3>
              <p className="text-white/80">
                {isPassed 
                  ? 'You passed the quiz! Great job on mastering this topic.'
                  : 'You need 70% to pass. Review the questions below and try again.'
                }
              </p>
            </div>
          </div>

          {/* Question Details */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white">Question Review</h3>
            {questionDetails.map((detail, index) => (
              <div key={detail.questionId} className={`p-4 rounded-lg border ${
                detail.isCorrect 
                  ? 'bg-green-500/10 border-green-500/30' 
                  : 'bg-red-500/10 border-red-500/30'
              }`}>
                <div className="flex items-start space-x-3">
                  <div className={`mt-1 ${detail.isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                    {detail.isCorrect ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <XCircle className="h-5 w-5" />
                    )}
                  </div>
                  <div className="flex-grow space-y-2">
                    <p className="text-sm text-white/60">Question {index + 1}</p>
                    {detail.questionText && (
                      <p className="text-white font-medium">{detail.questionText}</p>
                    )}
                    <div className="space-y-1">
                      <p className={`text-sm ${detail.isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                        Your answer: {detail.userAnswer || 'Not answered'}
                      </p>
                      {!detail.isCorrect && detail.correctAnswer && (
                        <p className="text-green-400 text-sm">Correct answer: {detail.correctAnswer}</p>
                      )}
                      {detail.isCorrect && detail.correctAnswer && (
                        <p className="text-green-400 text-sm">✓ {detail.correctAnswer}</p>
                      )}
                    </div>
                    {detail.explanation && (
                      <div className="mt-2 p-2 bg-white/5 rounded-md">
                        <p className="text-sm text-white/70">
                          <span className="font-medium text-white/80">Explanation:</span> {detail.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Button 
              onClick={handleViewDashboard}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              <Trophy className="mr-2 h-4 w-4" />
              View Dashboard
            </Button>
            <Button 
              onClick={onRestart}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
            <Button 
              onClick={() => window.location.href = '/topics'}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              Choose Another Topic
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  </>
  );
};

export default SimpleQuizResults;
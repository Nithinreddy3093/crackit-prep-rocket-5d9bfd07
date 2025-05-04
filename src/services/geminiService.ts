
/**
 * Service for interacting with Google's Gemini AI
 */

const GEMINI_API_KEY = "AIzaSyDmYenUZpMg1c-qfj3TFF3-iVrOZmgeSHk";
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

export interface QuizResult {
  score: number;
  totalQuestions: number;
  correctAnswers: number[];
  wrongAnswers: number[];
  topic: string;
  questionDetails?: {
    questionId: string;
    question: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
  }[];
}

export interface AIFeedback {
  strengths: string[];
  weaknesses: string[];
  recommendations: {
    title: string;
    type: 'video' | 'article' | 'practice';
    link: string;
  }[];
}

/**
 * Generate AI feedback based on quiz results
 */
export const generateAIFeedback = async (quizResult: QuizResult): Promise<AIFeedback> => {
  try {
    let prompt = `
      I've just taken a quiz on ${quizResult.topic} and scored ${quizResult.score} out of ${quizResult.totalQuestions}.
      The questions I got correct were questions: ${quizResult.correctAnswers.join(', ')}.
      The questions I got wrong were questions: ${quizResult.wrongAnswers.join(', ')}.
    `;
    
    // Add detailed question information if available
    if (quizResult.questionDetails && quizResult.questionDetails.length > 0) {
      prompt += `\nHere are the details of the questions answered:\n`;
      quizResult.questionDetails.forEach(q => {
        prompt += `
          Question: ${q.question}
          My Answer: ${q.userAnswer}
          Correct Answer: ${q.correctAnswer}
          Correct: ${q.isCorrect}
        `;
      });
    }
    
    prompt += `
      Please provide:
      1. 3-4 strengths based on the correct answers
      2. 3-4 weaknesses based on the wrong answers
      3. 3-5 specific learning recommendations (videos, articles, or practice exercises) with links to help me improve
      
      Format your response as JSON with the following structure:
      {
        "strengths": ["strength1", "strength2", ...],
        "weaknesses": ["weakness1", "weakness2", ...],
        "recommendations": [
          {
            "title": "Resource title",
            "type": "video|article|practice",
            "link": "URL"
          },
          ...
        ]
      }
    `;

    const response = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024
        }
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Error from Gemini API:', data);
      return getFallbackFeedback(quizResult);
    }
    
    try {
      // Extract the JSON from the text response
      const text = data.candidates[0].content.parts[0].text;
      const jsonStr = text.match(/\{[\s\S]*\}/)[0];
      return JSON.parse(jsonStr);
    } catch (e) {
      console.error('Error parsing JSON from Gemini response:', e);
      return getFallbackFeedback(quizResult);
    }
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return getFallbackFeedback(quizResult);
  }
};

/**
 * Provides fallback feedback when the API call fails
 */
const getFallbackFeedback = (quizResult: QuizResult): AIFeedback => {
  const percentageScore = (quizResult.score / quizResult.totalQuestions) * 100;
  
  let strengths = ["Understanding of basic concepts"];
  let weaknesses = ["Applying concepts to complex problems"];
  
  // Generate more specific feedback based on available question details
  if (quizResult.questionDetails && quizResult.questionDetails.length > 0) {
    // Group questions by topic
    const correctByTopic: Record<string, string[]> = {};
    const incorrectByTopic: Record<string, string[]> = {};
    
    quizResult.questionDetails.forEach(detail => {
      const topic = detail.questionId.split('-')[0]; // e.g., "dsa-1" -> "dsa"
      
      if (detail.isCorrect) {
        if (!correctByTopic[topic]) correctByTopic[topic] = [];
        correctByTopic[topic].push(detail.question);
      } else {
        if (!incorrectByTopic[topic]) incorrectByTopic[topic] = [];
        incorrectByTopic[topic].push(detail.question);
      }
    });
    
    // Generate strengths from correct topics
    strengths = Object.entries(correctByTopic)
      .slice(0, 3)
      .map(([topic, questions]) => 
        `Strong understanding of ${topic.toUpperCase()} concepts (${questions.length} correct answers)`
      );
      
    if (strengths.length === 0) {
      strengths = ["Understanding of basic concepts"];
    }
    
    // Generate weaknesses from incorrect topics
    weaknesses = Object.entries(incorrectByTopic)
      .slice(0, 3)
      .map(([topic, questions]) => 
        `Need to improve knowledge in ${topic.toUpperCase()} (${questions.length} incorrect answers)`
      );
      
    if (weaknesses.length === 0) {
      weaknesses = ["Applying concepts to complex problems"];
    }
  }
  
  if (percentageScore > 70) {
    strengths.push(
      "Good overall knowledge of the subject",
      "Ability to apply concepts correctly"
    );
  } else {
    weaknesses.push(
      "Core concept understanding needs improvement",
      "Need more practice with fundamental principles"
    );
  }
  
  // Generate topic-specific recommendations
  const recommendations = [];
  const topic = quizResult.topic.toLowerCase();
  
  if (topic === 'dsa') {
    recommendations.push(
      {
        title: "Data Structures and Algorithms in Python",
        type: "video" as const,
        link: "https://www.youtube.com/watch?v=kQDxmjfkIKY"
      },
      {
        title: "Grokking Algorithms: An illustrated guide",
        type: "article" as const,
        link: "https://www.manning.com/books/grokking-algorithms"
      },
      {
        title: "LeetCode Top Interview Questions",
        type: "practice" as const,
        link: "https://leetcode.com/explore/interview/card/top-interview-questions-easy/"
      }
    );
  } else if (topic === 'dbms') {
    recommendations.push(
      {
        title: "Database Design Course",
        type: "video" as const,
        link: "https://www.youtube.com/watch?v=ztHopE5Wnpc"
      },
      {
        title: "SQL Practice Problems",
        type: "practice" as const,
        link: "https://www.sqlpracticeproblems.com/"
      }
    );
  } else {
    recommendations.push(
      {
        title: `${quizResult.topic} Fundamentals Course`,
        type: "video" as const,
        link: "https://www.youtube.com/results?search_query=" + encodeURIComponent(`${quizResult.topic} tutorial`)
      },
      {
        title: `${quizResult.topic} Practice Problems`,
        type: "practice" as const,
        link: "https://www.geeksforgeeks.org/category/" + quizResult.topic.toLowerCase().replace(/[^a-z0-9]/g, '-')
      },
      {
        title: `Understanding ${quizResult.topic} - Comprehensive Guide`,
        type: "article" as const,
        link: "https://www.geeksforgeeks.org/category/" + quizResult.topic.toLowerCase().replace(/[^a-z0-9]/g, '-')
      }
    );
  }
  
  return {
    strengths,
    weaknesses,
    recommendations
  };
};

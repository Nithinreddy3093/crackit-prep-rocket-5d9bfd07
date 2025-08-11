import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TopicConfig {
  name: string;
  questionCount: number;
  timeLimit: number; // in minutes
  description: string;
  keywords: string[];
}

const TOPIC_CONFIGS: Record<string, TopicConfig> = {
  'dsa': {
    name: 'Data Structures and Algorithms',
    questionCount: 25,
    timeLimit: 38,
    description: 'Arrays, Linked Lists, Trees, Graphs, Sorting, and Searching Algorithms',
    keywords: ['arrays', 'linked lists', 'stacks', 'queues', 'trees', 'graphs', 'sorting', 'searching', 'dynamic programming', 'recursion']
  },
  'dbms': {
    name: 'Database Management',
    questionCount: 20,
    timeLimit: 30,
    description: 'SQL, Normalization, Transactions, RDBMS concepts and queries',
    keywords: ['SQL', 'normalization', 'ACID', 'transactions', 'indexing', 'joins', 'constraints', 'triggers', 'stored procedures']
  },
  'os': {
    name: 'Operating Systems',
    questionCount: 18,
    timeLimit: 27,
    description: 'Process Management, Memory Management, File Systems, Scheduling',
    keywords: ['processes', 'threads', 'memory management', 'file systems', 'scheduling', 'deadlocks', 'synchronization', 'virtual memory']
  },
  'oops': {
    name: 'Object-Oriented Programming',
    questionCount: 15,
    timeLimit: 23,
    description: 'Classes, Objects, Inheritance, Polymorphism, Encapsulation, Abstraction',
    keywords: ['classes', 'objects', 'inheritance', 'polymorphism', 'encapsulation', 'abstraction', 'constructors', 'methods']
  },
  'web-development': {
    name: 'Web Development',
    questionCount: 22,
    timeLimit: 33,
    description: 'HTML, CSS, JavaScript, React, RESTful APIs, and web architecture',
    keywords: ['HTML', 'CSS', 'JavaScript', 'React', 'APIs', 'HTTP', 'DOM', 'responsive design', 'frameworks']
  },
  'ai-ml': {
    name: 'AI & Machine Learning',
    questionCount: 12,
    timeLimit: 18,
    description: 'Neural Networks, Supervised/Unsupervised Learning, NLP, Computer Vision',
    keywords: ['neural networks', 'machine learning', 'deep learning', 'supervised learning', 'unsupervised learning', 'NLP', 'computer vision']
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { topicId, difficulty = 'mixed' } = await req.json();
    
    if (!topicId || !TOPIC_CONFIGS[topicId]) {
      return new Response(
        JSON.stringify({ error: 'Invalid topic ID' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const config = TOPIC_CONFIGS[topicId];
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    
    if (!geminiApiKey) {
      console.error('GEMINI_API_KEY not found in environment');
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`🤖 Generating ${config.questionCount} questions for ${config.name}`);

    const prompt = `Generate exactly ${config.questionCount} multiple choice questions about ${config.name}.

Topic: ${config.name}
Description: ${config.description}
Keywords to cover: ${config.keywords.join(', ')}

Requirements:
1. Generate exactly ${config.questionCount} questions
2. Difficulty distribution: 30% beginner, 50% intermediate, 20% advanced
3. Each question must have exactly 4 options (A, B, C, D)
4. Include diverse topics within the subject area
5. Ensure questions test practical understanding, not just memorization
6. Make sure all questions are unique and non-repetitive

Format your response as a JSON array with this exact structure:
[
  {
    "id": "unique_id_1",
    "question_text": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct_answer": "Option A",
    "explanation": "Brief explanation of why this is correct",
    "difficulty": "beginner|intermediate|advanced",
    "topic_id": "${topicId}"
  }
]

IMPORTANT: Return ONLY the JSON array, no other text or formatting.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192
          }
        })
      }
    );

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Gemini API error:', data);
      throw new Error('Failed to generate questions');
    }

    try {
      const text = data.candidates[0].content.parts[0].text;
      
      // Extract JSON from the response
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response');
      }
      
      const questions = JSON.parse(jsonMatch[0]);
      
      // Validate and transform questions
      const validatedQuestions = questions.map((q: any, index: number) => ({
        id: q.id || `${topicId}-${Date.now()}-${index}`,
        question_text: q.question_text || q.question,
        options: Array.isArray(q.options) ? q.options : [],
        correct_answer: q.correct_answer,
        explanation: q.explanation || '',
        difficulty: q.difficulty || 'intermediate',
        topic_id: topicId
      })).filter((q: any) => 
        q.question_text && 
        Array.isArray(q.options) && 
        q.options.length === 4 && 
        q.correct_answer
      );

      console.log(`✅ Generated ${validatedQuestions.length} valid questions`);

      return new Response(
        JSON.stringify({
          questions: validatedQuestions,
          topic: config.name,
          timeLimit: config.timeLimit,
          totalQuestions: validatedQuestions.length
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      throw new Error('Failed to parse generated questions');
    }

  } catch (error) {
    console.error('Error in generate-quiz-questions:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Internal server error' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
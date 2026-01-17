import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

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
    questionCount: 15,
    timeLimit: 38,
    description: 'Arrays, Linked Lists, Trees, Graphs, Sorting, Searching, Time Complexity',
    keywords: ['arrays', 'linked lists', 'stacks', 'queues', 'trees', 'graphs', 'sorting', 'searching', 'dynamic programming', 'recursion', 'time complexity']
  },
  'dbms': {
    name: 'Database Management',
    questionCount: 15,
    timeLimit: 30,
    description: 'SQL, Normalization, Transactions, RDBMS concepts',
    keywords: ['SQL', 'normalization', 'ACID', 'transactions', 'indexing', 'joins', 'constraints', 'triggers', 'stored procedures']
  },
  'os': {
    name: 'Operating Systems',
    questionCount: 15,
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
    questionCount: 15,
    timeLimit: 33,
    description: 'HTML, CSS, JavaScript, React, RESTful APIs, Web Architecture',
    keywords: ['HTML', 'CSS', 'JavaScript', 'React', 'APIs', 'HTTP', 'DOM', 'responsive design', 'frameworks']
  },
  'ai-ml': {
    name: 'AI & Machine Learning',
    questionCount: 15,
    timeLimit: 18,
    description: 'Neural Networks, Supervised/Unsupervised Learning, NLP, Computer Vision',
    keywords: ['neural networks', 'machine learning', 'deep learning', 'supervised learning', 'unsupervised learning', 'NLP', 'computer vision']
  },
  // Company-specific mock test topics
  'infosys-prep': {
    name: 'Infosys Interview Preparation',
    questionCount: 15,
    timeLimit: 45,
    description: 'Infosys InfyTQ and SP/SE interview pattern - Aptitude, Reasoning, Java, SQL, Pseudocode',
    keywords: ['aptitude', 'logical reasoning', 'verbal ability', 'Java programming', 'SQL queries', 'pseudocode', 'data structures', 'puzzles', 'InfyTQ pattern', 'coding test']
  },
  'tcs-nqt': {
    name: 'TCS NQT Preparation',
    questionCount: 15,
    timeLimit: 50,
    description: 'TCS National Qualifier Test pattern - Numerical Ability, Verbal, Reasoning, Programming Logic',
    keywords: ['numerical ability', 'verbal ability', 'reasoning ability', 'programming logic', 'coding', 'C programming', 'data interpretation', 'TCS NQT pattern', 'email writing']
  },
  'wipro-nlth': {
    name: 'Wipro NLTH Preparation',
    questionCount: 15,
    timeLimit: 45,
    description: 'Wipro National Level Talent Hunt - Aptitude, Essay Writing, Coding, Technical MCQs',
    keywords: ['aptitude', 'essay writing', 'coding round', 'Java', 'Python', 'data structures', 'logical reasoning', 'verbal ability', 'Wipro NLTH pattern']
  },
  'accenture-prep': {
    name: 'Accenture Interview Preparation',
    questionCount: 15,
    timeLimit: 40,
    description: 'Accenture hiring pattern - Cognitive Assessment, Technical, Coding, Communication',
    keywords: ['cognitive ability', 'technical MCQs', 'coding assessment', 'Java', 'Python', 'DBMS', 'networking', 'problem solving', 'Accenture pattern']
  },
  'cognizant-genC': {
    name: 'Cognizant GenC Preparation',
    questionCount: 15,
    timeLimit: 45,
    description: 'Cognizant GenC and GenC Elevate pattern - Aptitude, Automata Fix, Hand Coding',
    keywords: ['quantitative aptitude', 'logical reasoning', 'automata fix', 'hand coding', 'Java', 'Python', 'SQL', 'verbal ability', 'Cognizant GenC pattern']
  },
  'aptitude': {
    name: 'General Aptitude',
    questionCount: 15,
    timeLimit: 30,
    description: 'Quantitative Aptitude, Logical Reasoning, Verbal Ability for placement tests',
    keywords: ['percentages', 'profit loss', 'time speed distance', 'number series', 'coding decoding', 'blood relations', 'syllogisms', 'reading comprehension']
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { topicId, difficulty = 'mixed' } = await req.json();
    
    console.log('📥 Received request for topicId:', topicId);
    console.log('📚 Available topics:', Object.keys(TOPIC_CONFIGS));
    
    if (!topicId) {
      console.error('❌ No topic ID provided in request');
      return new Response(
        JSON.stringify({ 
          error: 'No topic ID provided',
          availableTopics: Object.keys(TOPIC_CONFIGS),
          message: 'Please select a valid topic from the available list'
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    if (!TOPIC_CONFIGS[topicId]) {
      console.error(`❌ Invalid topic ID provided: ${topicId}`);
      console.log('Valid topic IDs are:', Object.keys(TOPIC_CONFIGS));
      return new Response(
        JSON.stringify({ 
          error: 'Invalid topic ID',
          providedTopic: topicId,
          availableTopics: Object.keys(TOPIC_CONFIGS),
          message: `Topic "${topicId}" not found. Please choose from: ${Object.keys(TOPIC_CONFIGS).join(', ')}`
        }),
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

    const prompt = `You are Crackit's AI technical interview quiz generator. Create challenging but fair technical questions.

**TOPIC:** ${config.name}
**DESCRIPTION:** ${config.description}
**KEYWORDS TO COVER:** ${config.keywords.join(', ')}

**GENERATION RULES:**
1. Generate EXACTLY ${config.questionCount} FRESH, UNIQUE questions
2. Difficulty distribution: 40% Easy, 40% Medium, 20% Hard
3. Each question MUST have exactly 4 multiple-choice options
4. Mark EXACTLY ONE correct answer per question
5. Focus on interview-relevant, practical scenarios
6. Ensure technical accuracy and clarity
7. Each question must be ORIGINAL - avoid common/repeated questions
8. Make all options plausible distractors to test true understanding

**QUALITY STANDARDS:**
- Clear, unambiguous question text
- Options should be mutually exclusive and plausible
- Correct answer must be unambiguously correct
- Explanation should be educational and brief
- Use industry-standard terminology
- Real-world relevance to technical interviews
- No ambiguous or trick questions

**OUTPUT FORMAT (JSON ONLY):**
[
  {
    "question_text": "What is the time complexity of binary search on a sorted array?",
    "options": ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    "correct_answer": "O(log n)",
    "explanation": "Binary search divides the search space in half with each comparison, resulting in logarithmic time complexity.",
    "difficulty": "easy"
  }
]

**CRITICAL:** Return ONLY the JSON array with no markdown, code blocks, or additional text. The correct_answer MUST match exactly one of the options (case-sensitive).`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${geminiApiKey}`,
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
      
      // Validate and transform questions with proper UUIDs
      const validatedQuestions = questions.map((q: any, index: number) => ({
        id: crypto.randomUUID(), // Generate proper UUID
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
      
      // Store questions in database for future secure access
      if (validatedQuestions.length > 0) {
        console.log(`💾 Storing ${validatedQuestions.length} questions in database...`);
        
        const { error: insertError } = await supabase
          .from('questions')
          .insert(validatedQuestions.map(q => ({
            id: q.id,
            question_text: q.question_text,
            options: q.options,
            correct_answer: q.correct_answer,
            explanation: q.explanation,
            difficulty: q.difficulty,
            topic_id: q.topic_id
          })));

        if (insertError) {
          console.error('Error storing questions:', insertError);
          // Don't fail the entire request, just log the error
        } else {
          console.log('✅ Questions stored successfully in database');
        }
      }

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
    console.error('❌ Error in generate-quiz-questions:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Internal server error',
        message: 'Failed to generate quiz questions. Please try again or select a different topic.',
        availableTopics: Object.keys(TOPIC_CONFIGS)
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
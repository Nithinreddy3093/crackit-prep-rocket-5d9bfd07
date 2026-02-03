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
  timeLimit: number;
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
  // Product-Based Companies
  'ibm-prep': {
    name: 'IBM Interview Preparation',
    questionCount: 15,
    timeLimit: 45,
    description: 'IBM hiring pattern - Cognitive Ability, Technical Assessment, Coding, System Design basics',
    keywords: ['cognitive ability', 'numerical reasoning', 'verbal reasoning', 'Java', 'Python', 'data structures', 'algorithms', 'SQL', 'cloud computing', 'IBM pattern', 'problem solving']
  },
  'amazon-sde': {
    name: 'Amazon SDE Preparation',
    questionCount: 15,
    timeLimit: 50,
    description: 'Amazon SDE interview pattern - Leadership Principles, DSA, System Design, Behavioral',
    keywords: ['leadership principles', 'data structures', 'algorithms', 'system design', 'scalability', 'AWS', 'OOP', 'dynamic programming', 'trees', 'graphs', 'Amazon LP', 'STAR method']
  },
  'microsoft-prep': {
    name: 'Microsoft Interview Preparation',
    questionCount: 15,
    timeLimit: 50,
    description: 'Microsoft hiring pattern - DSA, Problem Solving, System Design, Behavioral',
    keywords: ['data structures', 'algorithms', 'problem solving', 'system design', 'Azure', 'C#', 'OOP', 'design patterns', 'coding', 'Microsoft interview', 'growth mindset']
  },
  'google-prep': {
    name: 'Google Interview Preparation',
    questionCount: 15,
    timeLimit: 50,
    description: 'Google hiring pattern - DSA, Algorithms, System Design, Googleyness',
    keywords: ['data structures', 'algorithms', 'complexity analysis', 'system design', 'distributed systems', 'problem solving', 'coding', 'Google interview', 'Googleyness', 'leadership']
  },
  'capgemini-prep': {
    name: 'Capgemini Interview Preparation',
    questionCount: 15,
    timeLimit: 40,
    description: 'Capgemini hiring pattern - Game-based Assessment, Technical MCQs, Pseudo Coding',
    keywords: ['aptitude', 'logical reasoning', 'pseudo code', 'Java', 'Python', 'SQL', 'behavioral', 'game-based assessment', 'Capgemini pattern', 'technical MCQs']
  },
  'deloitte-prep': {
    name: 'Deloitte Interview Preparation',
    questionCount: 15,
    timeLimit: 40,
    description: 'Deloitte hiring pattern - Aptitude, Case Studies, Technical, Group Discussion',
    keywords: ['aptitude', 'verbal reasoning', 'case studies', 'consulting', 'technical MCQs', 'Java', 'SQL', 'group discussion', 'Deloitte pattern', 'business acumen']
  },
  'hcl-prep': {
    name: 'HCL Interview Preparation',
    questionCount: 15,
    timeLimit: 40,
    description: 'HCL TechBee and regular hiring pattern - Aptitude, Technical, Coding Assessment',
    keywords: ['aptitude', 'logical reasoning', 'technical MCQs', 'Java', 'C programming', 'SQL', 'networking', 'operating systems', 'HCL pattern', 'coding']
  },
  'tech-mahindra-prep': {
    name: 'Tech Mahindra Interview Preparation',
    questionCount: 15,
    timeLimit: 40,
    description: 'Tech Mahindra hiring pattern - Aptitude, Essay, Technical, Coding',
    keywords: ['aptitude', 'essay writing', 'technical MCQs', 'Java', 'Python', 'networking', 'DBMS', 'coding', 'Tech Mahindra pattern', 'verbal ability']
  },
  'aptitude': {
    name: 'General Aptitude',
    questionCount: 15,
    timeLimit: 30,
    description: 'Quantitative Aptitude, Logical Reasoning, Verbal Ability for placement tests',
    keywords: ['percentages', 'profit loss', 'time speed distance', 'number series', 'coding decoding', 'blood relations', 'syllogisms', 'reading comprehension']
  },
  // UPSC Civil Services Topics
  'upsc-polity': {
    name: 'Indian Polity & Governance (UPSC)',
    questionCount: 15,
    timeLimit: 30,
    description: 'UPSC Prelims pattern - Constitution, Parliament, Judiciary, Federalism, Local Governance',
    keywords: ['constitution', 'fundamental rights', 'directive principles', 'parliament', 'supreme court', 'high court', 'president', 'governor', 'panchayati raj', 'constitutional amendments', 'federalism', 'centre-state relations', 'election commission']
  },
  'upsc-history': {
    name: 'Indian History (UPSC)',
    questionCount: 15,
    timeLimit: 30,
    description: 'UPSC Prelims pattern - Ancient, Medieval, Modern India, Freedom Struggle, Art & Culture',
    keywords: ['indus valley', 'vedic period', 'maurya empire', 'gupta dynasty', 'delhi sultanate', 'mughal empire', 'british rule', 'freedom movement', 'gandhi', 'nehru', 'indian art', 'architecture', 'cultural heritage']
  },
  'upsc-geography': {
    name: 'Indian & World Geography (UPSC)',
    questionCount: 15,
    timeLimit: 30,
    description: 'UPSC Prelims pattern - Physical, Economic, Human Geography, Environment',
    keywords: ['indian rivers', 'mountains', 'climate', 'monsoon', 'soil types', 'natural resources', 'agriculture', 'industries', 'population', 'urbanization', 'world geography', 'continents', 'oceans']
  },
  'upsc-economy': {
    name: 'Indian Economy (UPSC)',
    questionCount: 15,
    timeLimit: 30,
    description: 'UPSC Prelims pattern - Macroeconomics, Planning, Banking, Budget, International Trade',
    keywords: ['gdp', 'inflation', 'monetary policy', 'fiscal policy', 'rbi', 'banking', 'budget', 'taxation', 'five year plans', 'niti aayog', 'fdi', 'exports', 'imports', 'government schemes']
  },
  'upsc-science': {
    name: 'Science & Technology (UPSC)',
    questionCount: 15,
    timeLimit: 25,
    description: 'UPSC Prelims pattern - Current S&T developments, Space, Biotech, IT, Defense',
    keywords: ['isro', 'space missions', 'drdo', 'nuclear energy', 'biotechnology', 'nanotechnology', 'artificial intelligence', 'cyber security', 'it act', 'scientific discoveries', 'health technology']
  },
  'upsc-environment': {
    name: 'Environment & Ecology (UPSC)',
    questionCount: 15,
    timeLimit: 25,
    description: 'UPSC Prelims pattern - Biodiversity, Climate Change, Conservation, Environmental Laws',
    keywords: ['biodiversity', 'hotspots', 'national parks', 'wildlife sanctuaries', 'climate change', 'global warming', 'pollution', 'waste management', 'environmental laws', 'paris agreement', 'sustainable development', 'renewable energy']
  },
  'upsc-csat': {
    name: 'CSAT Paper II (UPSC)',
    questionCount: 20,
    timeLimit: 40,
    description: 'UPSC CSAT pattern - Comprehension, Logical Reasoning, Analytical Ability, Decision Making',
    keywords: ['reading comprehension', 'logical reasoning', 'analytical ability', 'decision making', 'problem solving', 'data interpretation', 'basic numeracy', 'mental ability', 'critical thinking']
  },
  'upsc-current-affairs': {
    name: 'Current Affairs (UPSC)',
    questionCount: 15,
    timeLimit: 30,
    description: 'UPSC pattern - National & International events, Government Schemes, Summits, Awards',
    keywords: ['national events', 'international relations', 'government schemes', 'budget highlights', 'supreme court judgments', 'appointments', 'awards', 'summits', 'sports', 'science news']
  },
  'upsc-ethics': {
    name: 'Ethics & Integrity (UPSC Mains)',
    questionCount: 15,
    timeLimit: 30,
    description: 'UPSC Mains GS Paper IV pattern - Ethics in Public Administration, Case Studies',
    keywords: ['ethics', 'integrity', 'aptitude', 'emotional intelligence', 'public service values', 'probity', 'accountability', 'transparency', 'case studies', 'moral thinkers', 'corporate governance']
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { topicId } = await req.json();
    
    console.log('📥 Received request for topicId:', topicId);
    console.log('📚 Available topics:', Object.keys(TOPIC_CONFIGS));
    
    if (!topicId) {
      return new Response(
        JSON.stringify({ 
          error: 'No topic ID provided',
          availableTopics: Object.keys(TOPIC_CONFIGS)
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    if (!TOPIC_CONFIGS[topicId]) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid topic ID',
          providedTopic: topicId,
          availableTopics: Object.keys(TOPIC_CONFIGS)
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const config = TOPIC_CONFIGS[topicId];
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    
    if (!lovableApiKey) {
      console.error('LOVABLE_API_KEY not found in environment');
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`🤖 Generating ${config.questionCount} questions for ${config.name}`);

    const systemPrompt = `You are a technical interview quiz generator. Create challenging but fair multiple-choice questions. Return ONLY a valid JSON array with no markdown, code blocks, or extra text.`;

    const userPrompt = `Generate exactly ${config.questionCount} multiple-choice questions for: ${config.name}

Topic: ${config.description}
Keywords: ${config.keywords.join(', ')}

Requirements:
- Difficulty mix: 40% Easy, 40% Medium, 20% Hard
- Each question has exactly 4 options
- Only ONE correct answer per question
- Focus on practical interview scenarios

Return ONLY this JSON array format:
[{"question_text":"Question?","options":["A","B","C","D"],"correct_answer":"B","explanation":"Why B is correct","difficulty":"easy"}]`;

    // Retry logic
    const maxRetries = 3;
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        console.log(`Attempt ${attempt + 1}/${maxRetries}`);
        
        const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${lovableApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt }
            ],
            temperature: 0.7,
            max_tokens: 8192
          })
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`API error (${response.status}):`, errorText);
          
          if (response.status === 429) {
            const delay = Math.pow(2, attempt) * 1000;
            console.log(`Rate limited, waiting ${delay}ms...`);
            await new Promise(r => setTimeout(r, delay));
            continue;
          }
          
          if (response.status === 402) {
            throw new Error('AI credits exhausted. Please try again later.');
          }
          
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        
        if (!content) {
          throw new Error('No content in API response');
        }

        // Extract JSON from response
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        if (!jsonMatch) {
          console.error('No JSON found in:', content.substring(0, 200));
          throw new Error('Invalid response format');
        }
        
        const questions = JSON.parse(jsonMatch[0]);
        
        // Map AI difficulty to database values
        const mapDifficulty = (aiDifficulty: string): string => {
          const lower = (aiDifficulty || 'intermediate').toLowerCase().trim();
          if (lower === 'easy' || lower === 'beginner') return 'beginner';
          if (lower === 'medium' || lower === 'intermediate') return 'intermediate';
          if (lower === 'hard' || lower === 'advanced' || lower === 'difficult') return 'advanced';
          return 'intermediate'; // default
        };

        // Validate and transform questions
        const validatedQuestions = questions
          .map((q: any) => ({
            id: crypto.randomUUID(),
            question_text: q.question_text || q.question,
            options: Array.isArray(q.options) ? q.options : [],
            correct_answer: q.correct_answer,
            explanation: q.explanation || '',
            difficulty: mapDifficulty(q.difficulty),
            topic_id: topicId
          }))
          .filter((q: any) => 
            q.question_text && 
            q.options.length === 4 && 
            q.correct_answer
          );

        console.log(`✅ Generated ${validatedQuestions.length} valid questions`);
        
        // Store in database
        if (validatedQuestions.length > 0) {
          const { error: insertError } = await supabase
            .from('questions')
            .insert(validatedQuestions);

          if (insertError) {
            console.error('DB insert error:', insertError);
          } else {
            console.log('✅ Questions stored in database');
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
        
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        console.error(`Attempt ${attempt + 1} failed:`, lastError.message);
        
        if (attempt < maxRetries - 1) {
          await new Promise(r => setTimeout(r, Math.pow(2, attempt) * 1000));
        }
      }
    }
    
    throw lastError || new Error('Failed after retries');

  } catch (error) {
    console.error('❌ Error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Internal server error',
        message: 'Failed to generate quiz questions. Please try again.',
        availableTopics: Object.keys(TOPIC_CONFIGS)
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

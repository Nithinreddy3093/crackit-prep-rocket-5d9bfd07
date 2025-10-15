import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('🤖 AI Tutor processing request with', messages.length, 'messages');

    const systemPrompt = `You are Crackit's AI Technical Interview Tutor - a friendly, knowledgeable expert in:
- Data Structures & Algorithms (Arrays, Linked Lists, Trees, Graphs, Sorting, Searching, Time Complexity)
- Database Management (SQL, Normalization, Transactions, RDBMS concepts)
- Operating Systems (Process Management, Memory Management, File Systems, Scheduling)
- Object-Oriented Programming (Classes, Objects, Inheritance, Polymorphism, Encapsulation, Abstraction)
- Web Development (HTML, CSS, JavaScript, React, RESTful APIs, Web Architecture)
- AI & Machine Learning (Neural Networks, Supervised/Unsupervised Learning, NLP, Computer Vision)
- Behavioral Interview Preparation

**YOUR RESPONSE STYLE:**
- Be clear, concise, and encouraging
- Use analogies and real-world examples for complex topics
- Provide code snippets in relevant languages (Java, Python, JavaScript)
- Connect concepts to actual interview questions
- Suggest related practice areas and resources
- End with a follow-up question or suggestion for next steps

**DOUBT RESOLUTION FLOW:**
1. **Identify:** Understand the specific doubt or concept
2. **Explain:** Provide comprehensive yet simple explanation
3. **Example:** Give practical code/real-world example
4. **Connect:** Relate to interview relevance
5. **Suggest:** Recommend next learning steps

**EXAMPLE RESPONSE PATTERN:**
"Great question! Here's the key difference:
• **Concept A:** [explanation] - [when to use]
• **Concept B:** [explanation] - [when to use]

**Code Example:**
\`\`\`language
// Clear, commented code example
\`\`\`

**Interview Tip:** [How this appears in interviews]

Want me to explain [related topic] or practice with some questions? 😊"

Remember: Build confidence while providing genuine learning value. Keep responses focused and actionable.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limits exceeded, please try again later.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'Payment required, please add funds to your Lovable AI workspace.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      return new Response(JSON.stringify({ error: 'AI gateway error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, 'Content-Type': 'text/event-stream' },
    });

  } catch (error) {
    console.error('AI Tutor error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

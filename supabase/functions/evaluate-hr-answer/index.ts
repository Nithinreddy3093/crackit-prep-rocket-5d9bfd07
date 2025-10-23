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
    const { question, answer, position } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const systemPrompt = `You are an expert HR interviewer evaluating candidate responses. Analyze the answer and provide:
1. A score from 1-10
2. Detailed feedback on strengths and weaknesses
3. Suggestions for improvement
4. An improved version of the answer

Be constructive, professional, and specific in your feedback.`;

    const userPrompt = `Position: ${position || 'General'}

Question: ${question}

Candidate's Answer: ${answer}

Please evaluate this answer and provide:
1. Score (1-10)
2. Strengths (what was good)
3. Weaknesses (what needs improvement)
4. Specific suggestions
5. An improved version of the answer

Format your response as JSON with these exact keys: score, strengths, weaknesses, suggestions, improved_answer`;

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
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Payment required. Please add credits to your Lovable AI workspace.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error('AI evaluation failed');
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    // Try to parse as JSON, otherwise return raw text
    let evaluation;
    try {
      evaluation = JSON.parse(aiResponse);
    } catch {
      // If not valid JSON, structure it ourselves
      evaluation = {
        score: 7,
        strengths: 'Unable to parse AI response',
        weaknesses: 'Unable to parse AI response',
        suggestions: aiResponse,
        improved_answer: 'Please try again'
      };
    }

    return new Response(
      JSON.stringify(evaluation),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in evaluate-hr-answer function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
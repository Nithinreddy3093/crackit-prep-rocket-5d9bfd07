import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const AIChatAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const streamChat = async (userMessage: string) => {
    setIsLoading(true);
    const newMessages = [...messages, { role: 'user' as const, content: userMessage }];
    setMessages(newMessages);
    setInput('');

    try {
      const { data, error } = await supabase.functions.invoke('ai-tutor', {
        body: { messages: newMessages }
      });

      if (error) throw error;

      // Handle non-streaming response (JSON object)
      if (data && typeof data === 'object' && !data.body) {
        // Direct JSON response from edge function
        const content = data.response || data.message || data.content || '';
        if (content) {
          setMessages([...newMessages, { role: 'assistant', content }]);
        } else {
          // Try to extract from choices format
          const choicesContent = data.choices?.[0]?.message?.content;
          if (choicesContent) {
            setMessages([...newMessages, { role: 'assistant', content: choicesContent }]);
          } else {
            throw new Error('No response content received');
          }
        }
        return;
      }

      // Handle streaming response
      if (data?.body?.getReader) {
        const reader = data.body.getReader();
        const decoder = new TextDecoder();
        let assistantMessage = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const jsonStr = line.slice(6).trim();
              if (jsonStr === '[DONE]') continue;

              try {
                const parsed = JSON.parse(jsonStr);
                const content = parsed.choices?.[0]?.delta?.content;
                if (content) {
                  assistantMessage += content;
                  setMessages([...newMessages, { role: 'assistant', content: assistantMessage }]);
                }
              } catch (e) {
                // Incomplete JSON, continue
              }
            }
          }
        }
      } else {
        throw new Error('Unexpected response format from AI tutor');
      }
    } catch (error) {
      console.error('Chat error:', error);
      toast.error('Failed to get response from AI tutor. Please try again.');
      // Remove the user message if we failed to get a response
      setMessages(messages);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    streamChat(input);
  };

  return (
    <Card className="flex flex-col h-[600px] max-w-4xl mx-auto">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Bot className="w-6 h-6 text-primary" />
          Crackit AI Tutor
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Ask me anything about Data Structures, Algorithms, DBMS, OS, OOP, Web Dev, or AI/ML
        </p>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <Bot className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-lg font-medium">Start a conversation!</p>
            <p className="text-sm mt-2">Ask me about technical concepts, interview preparation, or coding problems</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-primary" />
                  </div>
                )}
                <div
                  className={`rounded-lg px-4 py-2 max-w-[80%] ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-primary-foreground" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-primary animate-pulse" />
                </div>
                <div className="bg-muted rounded-lg px-4 py-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </ScrollArea>

      <div className="p-4 border-t">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about technical concepts..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={!input.trim() || isLoading}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </Card>
  );
};

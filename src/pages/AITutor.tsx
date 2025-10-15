import { AIChatAssistant } from '@/components/chat/AIChatAssistant';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const AITutor = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-background/95">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto mb-8">
          <h1 className="text-4xl font-bold text-center mb-4">AI Interview Tutor</h1>
          <p className="text-center text-muted-foreground">
            Get personalized help with technical interview preparation from our AI tutor
          </p>
        </div>
        <AIChatAssistant />
      </main>
      <Footer />
    </div>
  );
};

export default AITutor;

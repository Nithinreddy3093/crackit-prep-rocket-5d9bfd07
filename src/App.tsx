
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Topics from "./pages/Topics";
import About from "./pages/About";
import Pricing from "./pages/Pricing";
import Dashboard from "./pages/Dashboard";
import LogoAnimation from "./components/LogoAnimation";

const queryClient = new QueryClient();

const App = () => {
  const [showAnimation, setShowAnimation] = useState(true);
  
  // Add Perplexity API key to the window object for global access
  useEffect(() => {
    if (typeof window !== "undefined") {
      // @ts-ignore
      window.PERPLEXITY_API_KEY = "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";
    }
  }, []);

  // Check if the user has seen the animation before
  useEffect(() => {
    const hasSeenAnimation = localStorage.getItem('hasSeenAnimation');
    if (hasSeenAnimation) {
      setShowAnimation(false);
    } else {
      // Set a flag in localStorage so we don't show the animation again on refresh
      localStorage.setItem('hasSeenAnimation', 'true');
    }
  }, []);

  const handleAnimationComplete = () => {
    setShowAnimation(false);
  };

  if (showAnimation) {
    return <LogoAnimation onAnimationComplete={handleAnimationComplete} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/topics" element={<Topics />} />
              <Route path="/topics/:topicId" element={<Topics />} />
              <Route path="/about" element={<About />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/dashboard" element={<Dashboard />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;


import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  // Add Perplexity API key to the window object for global access
  useEffect(() => {
    if (typeof window !== "undefined") {
      // @ts-ignore
      window.PERPLEXITY_API_KEY = "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";
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/signup" element={<SignUp />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

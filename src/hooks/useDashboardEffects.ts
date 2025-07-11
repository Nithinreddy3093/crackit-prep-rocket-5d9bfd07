import { useEffect } from 'react';
import { toast } from "@/components/ui/use-toast";

interface User {
  name?: string;
}

export function useDashboardEffects(user: User | null) {
  useEffect(() => {
    // Only show welcome toast once per session
    const hasSeenWelcome = sessionStorage.getItem('hasSeenWelcome');
    if (!hasSeenWelcome && user) {
      setTimeout(() => {
        toast({
          title: `Welcome back, ${user.name}!`,
          description: "Your dashboard has been updated with new features.",
          variant: "default",
        });
        sessionStorage.setItem('hasSeenWelcome', 'true');
      }, 1000);
    }
  }, [user]);
}
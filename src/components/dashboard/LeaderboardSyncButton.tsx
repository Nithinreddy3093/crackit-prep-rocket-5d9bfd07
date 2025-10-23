import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const LeaderboardSyncButton = () => {
  const { toast } = useToast();
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const { data, error } = await supabase.functions.invoke('sync-leaderboard');

      if (error) throw error;

      toast({
        title: 'Leaderboard Synced!',
        description: `Successfully synced ${data.synced} users to leaderboard`,
      });

      // Reload page to show updated leaderboard
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error('Sync error:', error);
      toast({
        title: 'Sync Failed',
        description: 'Unable to sync leaderboard. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <Button 
      onClick={handleSync}
      disabled={isSyncing}
      variant="outline"
      size="sm"
      className="gap-2"
    >
      <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
      {isSyncing ? 'Syncing...' : 'Sync Leaderboard'}
    </Button>
  );
};

export default LeaderboardSyncButton;
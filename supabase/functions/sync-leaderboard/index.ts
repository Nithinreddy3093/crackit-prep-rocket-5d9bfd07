import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get all users who have completed quizzes
    const { data: users, error: usersError } = await supabaseClient
      .from('quiz_sessions')
      .select('user_id')
      .not('completed_at', 'is', null)
      .not('user_id', 'is', null);

    if (usersError) throw usersError;

    // Get unique user IDs
    const uniqueUserIds = [...new Set(users?.map(u => u.user_id) || [])];

    console.log(`Syncing ${uniqueUserIds.length} users to leaderboard`);

    // Sync each user
    for (const userId of uniqueUserIds) {
      const { error: syncError } = await supabaseClient
        .rpc('sync_user_to_leaderboard', { p_user_id: userId });
      
      if (syncError) {
        console.error(`Error syncing user ${userId}:`, syncError);
      }
    }

    // Update all rankings once after syncing all users
    const { error: rankingError } = await supabaseClient
      .rpc('update_leaderboard_rankings');
    
    if (rankingError) {
      console.error('Error updating rankings:', rankingError);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        synced: uniqueUserIds.length,
        message: `Successfully synced ${uniqueUserIds.length} users to leaderboard` 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in sync-leaderboard function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
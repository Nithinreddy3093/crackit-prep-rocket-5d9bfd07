// Hook for badge and strength computation
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQueryClient } from '@tanstack/react-query';
import {
  computeUserBadges,
  computeUserStrengths,
  computeBadgeStats,
  calculateStreak
} from '@/services/badgeEngine';
import type {
  UserBadgeWithDefinition,
  UserStrengthsData,
  UserBadgeStats,
  UserStreak
} from '@/services/badgeEngine';

interface UseBadgeSystemReturn {
  badges: UserBadgeWithDefinition[];
  strengths: UserStrengthsData;
  stats: UserBadgeStats | null;
  streak: UserStreak | null;
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

export const useBadgeSystem = (forceRefresh?: boolean): UseBadgeSystemReturn => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [badges, setBadges] = useState<UserBadgeWithDefinition[]>([]);
  const [strengths, setStrengths] = useState<UserStrengthsData>({
    strengths: [],
    weaknesses: [],
    recommendations: []
  });
  const [stats, setStats] = useState<UserBadgeStats | null>(null);
  const [streak, setStreak] = useState<UserStreak | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel
      const [badgesData, strengthsData, statsData, streakData] = await Promise.all([
        computeUserBadges(user.id),
        computeUserStrengths(user.id),
        computeBadgeStats(user.id),
        calculateStreak(user.id)
      ]);

      setBadges(badgesData);
      setStrengths(strengthsData);
      setStats(statsData);
      setStreak(streakData);
    } catch (err) {
      console.error('Error in useBadgeSystem:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch badge data'));
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const refresh = useCallback(async () => {
    // Invalidate related queries
    await queryClient.invalidateQueries({ queryKey: ['userBadges'] });
    await queryClient.invalidateQueries({ queryKey: ['userPerformance'] });
    await fetchData();
  }, [fetchData, queryClient]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle force refresh
  useEffect(() => {
    if (forceRefresh) {
      console.log('Force refreshing badge system data');
      refresh();
    }
  }, [forceRefresh, refresh]);

  return {
    badges,
    strengths,
    stats,
    streak,
    loading,
    error,
    refresh
  };
};

export default useBadgeSystem;

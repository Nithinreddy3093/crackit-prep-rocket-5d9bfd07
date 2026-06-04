import { useCallback, useEffect, useMemo, useState } from 'react';
import { getTodaysPlan, type Branch, type PlacementTask } from '@/data/placementData';

const todayKey = () => new Date().toDateString();

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate: string | null;
  completionLog: string[]; // ISO date strings (YYYY-MM-DD)
}

const emptyStreak: StreakData = {
  currentStreak: 0,
  longestStreak: 0,
  lastCompletedDate: null,
  completionLog: [],
};

const isoDay = (d: Date) => d.toISOString().slice(0, 10);
const daysBetween = (a: string, b: string) =>
  Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000);

export interface PlacementProgress {
  intensity: 3 | 5;
  setIntensity: (v: 3 | 5) => void;
  tasks: PlacementTask[];
  done: Record<string, boolean>;
  toggle: (id: string) => void;
  pct: number;
  completedCount: number;
  streak: StreakData;
  last7Days: { date: string; done: boolean }[];
  resumeChecks: Record<string, boolean>;
  toggleResume: (item: string) => void;
  hrAnswer: string;
  setHrAnswer: (v: string) => void;
  targetCompanies: string[];
  toggleTargetCompany: (c: string) => void;
}

export function usePlacementProgress(branch: Branch): PlacementProgress {
  const intensityKey = `crackit_placement_intensity_${branch}`;
  const tasksKey = `crackit_placement_tasks_${branch}_${todayKey()}`;
  const streakKey = `crackit_placement_streak_${branch}`;
  const resumeKey = `crackit_placement_resume_${branch}`;
  const hrKey = `crackit_placement_hr_${branch}_${isoDay(new Date())}`;
  const companiesKey = `crackit_placement_targets_${branch}`;

  const [intensity, setIntensityState] = useState<3 | 5>(() => {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(intensityKey) : null;
    return raw === '5' ? 5 : 3;
  });

  const tasks = useMemo(() => getTodaysPlan(branch, intensity), [branch, intensity]);

  const [done, setDone] = useState<Record<string, boolean>>(() => {
    try {
      const raw = localStorage.getItem(tasksKey);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  const [streak, setStreak] = useState<StreakData>(() => {
    try {
      const raw = localStorage.getItem(streakKey);
      return raw ? { ...emptyStreak, ...JSON.parse(raw) } : emptyStreak;
    } catch {
      return emptyStreak;
    }
  });

  const [resumeChecks, setResumeChecks] = useState<Record<string, boolean>>(() => {
    try {
      const raw = localStorage.getItem(resumeKey);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  const [hrAnswer, setHrAnswerState] = useState<string>(() => {
    return localStorage.getItem(hrKey) || '';
  });

  const [targetCompanies, setTargetCompanies] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(companiesKey);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const setIntensity = useCallback((v: 3 | 5) => {
    setIntensityState(v);
    localStorage.setItem(intensityKey, String(v));
  }, [intensityKey]);

  const toggle = useCallback((id: string) => {
    setDone((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      localStorage.setItem(tasksKey, JSON.stringify(next));
      return next;
    });
  }, [tasksKey]);

  const completedCount = tasks.filter((t) => done[t.id]).length;
  const pct = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0;
  const allDone = tasks.length > 0 && completedCount === tasks.length;

  // Update streak when all tasks for the day are completed
  useEffect(() => {
    if (!allDone) return;
    const today = isoDay(new Date());
    if (streak.lastCompletedDate === today) return;

    setStreak((prev) => {
      const log = prev.completionLog.includes(today)
        ? prev.completionLog
        : [...prev.completionLog, today].slice(-60);
      let newCurrent = 1;
      if (prev.lastCompletedDate) {
        const diff = daysBetween(prev.lastCompletedDate, today);
        if (diff === 1) newCurrent = prev.currentStreak + 1;
        else if (diff === 0) newCurrent = prev.currentStreak;
        else newCurrent = 1;
      }
      const next: StreakData = {
        currentStreak: newCurrent,
        longestStreak: Math.max(prev.longestStreak, newCurrent),
        lastCompletedDate: today,
        completionLog: log,
      };
      localStorage.setItem(streakKey, JSON.stringify(next));
      return next;
    });
  }, [allDone, streak.lastCompletedDate, streakKey]);

  const last7Days = useMemo(() => {
    const out: { date: string; done: boolean }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const iso = isoDay(d);
      out.push({ date: iso, done: streak.completionLog.includes(iso) });
    }
    return out;
  }, [streak.completionLog]);

  const toggleResume = useCallback((item: string) => {
    setResumeChecks((prev) => {
      const next = { ...prev, [item]: !prev[item] };
      localStorage.setItem(resumeKey, JSON.stringify(next));
      return next;
    });
  }, [resumeKey]);

  const setHrAnswer = useCallback((v: string) => {
    setHrAnswerState(v);
    localStorage.setItem(hrKey, v);
  }, [hrKey]);

  const toggleTargetCompany = useCallback((c: string) => {
    setTargetCompanies((prev) => {
      const next = prev.includes(c)
        ? prev.filter((x) => x !== c)
        : prev.length < 3
          ? [...prev, c]
          : prev;
      localStorage.setItem(companiesKey, JSON.stringify(next));
      return next;
    });
  }, [companiesKey]);

  return {
    intensity,
    setIntensity,
    tasks,
    done,
    toggle,
    pct,
    completedCount,
    streak,
    last7Days,
    resumeChecks,
    toggleResume,
    hrAnswer,
    setHrAnswer,
    targetCompanies,
    toggleTargetCompany,
  };
}

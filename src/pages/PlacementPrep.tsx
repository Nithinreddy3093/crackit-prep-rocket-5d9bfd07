import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle2,
  Circle,
  Flame,
  Sparkles,
  Target,
  Calendar,
  Trophy,
  ArrowLeft,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  PLACEMENT_BRANCH_LIST,
  PLACEMENT_BRANCHES,
  TASK_TYPE_META,
  HR_QUESTIONS,
  RESUME_ICON,
  type Branch,
  type BranchConfig,
} from '@/data/placementData';
import { cn } from '@/lib/utils';

const STORAGE_KEY = 'crackit_placement_branch';
const TASKS_KEY_PREFIX = 'crackit_placement_tasks_';

// ---------------- Landing ----------------
const PlacementLanding: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Placement Prep — Branch-wise B.Tech Roadmap | CrackIt</title>
        <meta
          name="description"
          content="Daily, branch-specific placement prep for B.Tech students. CSE and ECE roadmaps with subjects, mock tests, and progress tracking."
        />
      </Helmet>

      {/* Hero */}
      <section className="relative py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-grid-soft opacity-40" />
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[460px] w-[860px] rounded-full bg-primary/20 blur-3xl" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary-glow">
            <Sparkles className="h-3.5 w-3.5" /> Placement Prep
          </span>
          <h1 className="mt-5 font-display text-4xl sm:text-6xl font-bold tracking-tight text-foreground">
            Your branch. Your roadmap. <br className="hidden sm:block" />
            <span className="gradient-text">Daily wins.</span>
          </h1>
          <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            A 90-day, branch-specific plan that turns syllabus chaos into a daily
            checklist. Choose your branch — we tune the path, the subjects, and
            the mock tests for you.
          </p>
        </div>
      </section>

      {/* Branch picker */}
      <section className="pb-16 sm:pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
            {PLACEMENT_BRANCH_LIST.map((b, i) => {
              const Icon = b.icon;
              return (
                <motion.button
                  key={b.branch}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  onClick={() => {
                    localStorage.setItem(STORAGE_KEY, b.branch);
                    navigate(`/placement-prep/${b.branch}`);
                  }}
                  className="group relative text-left rounded-2xl glass-strong p-6 sm:p-8 hover:border-primary/40 transition-all overflow-hidden"
                >
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
                  <div className="flex items-start justify-between gap-4">
                    <div className="h-12 w-12 rounded-xl bg-gradient-indigo flex items-center justify-center shadow-glow">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-xs uppercase tracking-wider text-muted-foreground">
                      {b.companies.length}+ companies
                    </span>
                  </div>
                  <h2 className="mt-5 font-display text-2xl font-bold text-foreground">
                    {b.label}
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">{b.tagline}</p>
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {b.subjects.slice(0, 5).map((s) => (
                      <span
                        key={s.id}
                        className="text-[11px] rounded-full border border-border/60 bg-card/60 px-2 py-0.5 text-foreground/70"
                      >
                        {s.name}
                      </span>
                    ))}
                  </div>
                  <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary-glow group-hover:gap-3 transition-all">
                    Start {b.branch.toUpperCase()} track
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Why daily consistency */}
          <div className="mt-16 grid sm:grid-cols-3 gap-4">
            {[
              { icon: Calendar, title: '90-day plan', body: '3 short tasks every day. No more 6-hour cram sessions.' },
              { icon: Flame, title: 'Streak-driven', body: 'Daily streaks + progress bars keep momentum on autopilot.' },
              { icon: Trophy, title: 'Company-ready', body: 'Branch-specific mocks tuned for TCS, Infy, Qualcomm, TI & more.' },
            ].map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="rounded-2xl glass p-5">
                  <Icon className="h-5 w-5 text-primary-glow" />
                  <h3 className="mt-3 font-semibold text-foreground">{f.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{f.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

// ---------------- Branch dashboard ----------------
const BranchDashboard: React.FC<{ config: BranchConfig }> = ({ config }) => {
  const navigate = useNavigate();
  const tasksKey = TASKS_KEY_PREFIX + config.branch + '_' + new Date().toDateString();
  const [done, setDone] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(tasksKey);
      if (raw) setDone(JSON.parse(raw));
    } catch {}
  }, [tasksKey]);

  const toggle = (id: string) => {
    setDone((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      localStorage.setItem(tasksKey, JSON.stringify(next));
      return next;
    });
  };

  const completed = config.todaysPlan.filter((t) => done[t.id]).length;
  const pct = Math.round((completed / config.todaysPlan.length) * 100);
  const Icon = config.icon;

  return (
    <>
      <Helmet>
        <title>{config.label} Placement Track | CrackIt</title>
        <meta name="description" content={config.tagline} />
      </Helmet>

      <section className="relative py-10 sm:py-14 overflow-hidden">
        <div className="absolute inset-0 bg-grid-soft opacity-30" />
        <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 h-[300px] w-[700px] rounded-full bg-primary/15 blur-3xl" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate('/placement-prep')}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="h-4 w-4" /> All branches
          </button>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <div className="h-14 w-14 rounded-2xl bg-gradient-indigo flex items-center justify-center shadow-glow">
              <Icon className="h-7 w-7 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
                {config.label}
              </h1>
              <p className="mt-1 text-sm sm:text-base text-muted-foreground">
                {config.tagline}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 grid lg:grid-cols-3 gap-6">
        {/* Today's plan */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl glass-strong p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary-glow" /> Today's Plan
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {completed} of {config.todaysPlan.length} done · keep your streak alive
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold gradient-text">{pct}%</div>
              </div>
            </div>
            <Progress value={pct} className="mt-3 h-1.5" />
            <ul className="mt-5 space-y-2">
              {config.todaysPlan.map((task) => {
                const meta = TASK_TYPE_META[task.type];
                const TIcon = meta.icon;
                const isDone = !!done[task.id];
                return (
                  <li key={task.id}>
                    <button
                      onClick={() => toggle(task.id)}
                      className={cn(
                        'w-full text-left flex items-center gap-3 rounded-xl border p-3 sm:p-4 transition-all min-h-[56px]',
                        isDone
                          ? 'border-primary/30 bg-primary/10'
                          : 'border-border/60 bg-card/40 hover:border-primary/30'
                      )}
                    >
                      {isDone ? (
                        <CheckCircle2 className="h-5 w-5 text-primary-glow shrink-0" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-primary-glow">
                          <TIcon className="h-3 w-3" /> {meta.label} · {task.estMinutes} min
                        </div>
                        <div
                          className={cn(
                            'mt-0.5 text-sm sm:text-base font-medium',
                            isDone ? 'text-muted-foreground line-through' : 'text-foreground'
                          )}
                        >
                          {task.title}
                        </div>
                      </div>
                      {task.topicId && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/quiz/${task.topicId}`);
                          }}
                        >
                          Start
                        </Button>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Roadmap */}
          <div className="rounded-2xl glass-strong p-5 sm:p-6">
            <h2 className="font-display text-xl font-bold text-foreground">
              90-day Roadmap
            </h2>
            <ol className="mt-5 relative border-l border-border/60 pl-5 space-y-5">
              {config.roadmap.map((phase, i) => (
                <li key={phase.id} className="relative">
                  <span className="absolute -left-[26px] top-1 h-3 w-3 rounded-full bg-gradient-indigo ring-4 ring-background" />
                  <div className="text-[10px] uppercase tracking-wider text-primary-glow">
                    Phase {i + 1} · {phase.weeks}
                  </div>
                  <div className="mt-0.5 font-semibold text-foreground">{phase.title}</div>
                  <div className="text-sm text-muted-foreground">{phase.description}</div>
                  <ul className="mt-2 flex flex-wrap gap-1.5">
                    {phase.outcomes.map((o) => (
                      <li
                        key={o}
                        className="text-[11px] rounded-full border border-border/60 bg-card/60 px-2 py-0.5 text-foreground/70"
                      >
                        {o}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </div>

          {/* Subjects */}
          <div className="rounded-2xl glass-strong p-5 sm:p-6">
            <h2 className="font-display text-xl font-bold text-foreground">
              Subjects to master
            </h2>
            <div className="mt-5 grid sm:grid-cols-2 gap-3">
              {config.subjects.map((s) => {
                const SIcon = s.icon;
                return (
                  <button
                    key={s.id}
                    onClick={() => s.topicId && navigate(`/quiz/${s.topicId}`)}
                    className="text-left flex items-start gap-3 rounded-xl border border-border/60 bg-card/40 p-4 hover:border-primary/40 transition-all"
                  >
                    <div className="h-9 w-9 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
                      <SIcon className="h-4.5 w-4.5 text-primary-glow" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-foreground text-sm">{s.name}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{s.blurb}</div>
                    </div>
                    {s.topicId && <ArrowRight className="h-4 w-4 text-muted-foreground mt-1" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Side column */}
        <div className="space-y-6">
          {/* Streak / progress */}
          <div className="rounded-2xl glass-strong p-5">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Flame className="h-4 w-4 text-primary-glow" /> Daily streak
            </div>
            <div className="mt-1 text-3xl font-bold gradient-text">
              {completed === config.todaysPlan.length ? '🔥 1 day' : '0 days'}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Finish today's plan to start your streak.
            </p>
          </div>

          {/* Resume kit */}
          <div className="rounded-2xl glass-strong p-5">
            <div className="flex items-center gap-2">
              <RESUME_ICON className="h-4 w-4 text-primary-glow" />
              <h3 className="font-semibold text-foreground">Resume checklist</h3>
            </div>
            <ul className="mt-3 space-y-2">
              {config.resumeChecklist.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-foreground/80">
                  <CheckCircle2 className="h-4 w-4 text-primary-glow shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Project ideas */}
          <div className="rounded-2xl glass-strong p-5">
            <h3 className="font-semibold text-foreground">Project ideas</h3>
            <ul className="mt-3 space-y-1.5">
              {config.projectIdeas.map((p) => (
                <li key={p} className="text-sm text-foreground/80">• {p}</li>
              ))}
            </ul>
          </div>

          {/* HR */}
          <div className="rounded-2xl glass-strong p-5">
            <h3 className="font-semibold text-foreground">HR practice questions</h3>
            <ul className="mt-3 space-y-1.5">
              {HR_QUESTIONS.slice(0, 5).map((q) => (
                <li key={q} className="text-sm text-foreground/80">• {q}</li>
              ))}
            </ul>
          </div>

          {/* Target companies */}
          <div className="rounded-2xl glass-strong p-5">
            <h3 className="font-semibold text-foreground">Target companies</h3>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {config.companies.map((c) => (
                <span
                  key={c}
                  className="text-[11px] rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-primary-glow"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// ---------------- Wrapper ----------------
const PlacementPrep: React.FC = () => {
  const { branch } = useParams<{ branch?: string }>();
  const navigate = useNavigate();
  const config = useMemo(() => {
    if (branch && (branch === 'cse' || branch === 'ece')) {
      return PLACEMENT_BRANCHES[branch as Branch];
    }
    return null;
  }, [branch]);

  // Auto-route a returning user to their saved branch when landing without a branch slug
  useEffect(() => {
    if (!branch) {
      const saved = localStorage.getItem(STORAGE_KEY);
      // Don't auto-redirect — let them re-pick. (Comment kept for future change.)
      void saved;
    }
  }, [branch, navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        {config ? <BranchDashboard config={config} /> : <PlacementLanding />}
      </main>
      <Footer />
    </div>
  );
};

export default PlacementPrep;

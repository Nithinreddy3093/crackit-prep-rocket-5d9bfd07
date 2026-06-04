
# Fixes & Upgrades Plan — Dashboard mobile + Placement Prep usefulness

No runtime/console errors are currently being thrown, so "errors" here means **layout + UX issues** the user is seeing. I'll address them in two focused phases plus a small polish pass.

---

## Phase A — Dashboard mobile responsiveness

**Problems found in `SimpleDashboard.tsx`:**
1. Header is `flex items-center justify-between` with `text-4xl` heading + 2 buttons → on phones the title squashes and buttons overflow.
2. `Tabs` use `grid-cols-4` with no wrap → labels clip on 360px screens.
3. Root padding is `p-6` (24px) → too tight on mobile; charts get crammed.
4. No bottom padding for the mobile bottom nav (`MobileBottomNav` overlaps the last card).
5. Stat cards stack 1-col on mobile (fine) but `text-2xl` numbers look unbalanced — should be `text-3xl` and centered.
6. Recent quiz rows: long topic names overflow without `truncate`.

**Fix (frontend-only, `SimpleDashboard.tsx`):**
- Header → `flex-col gap-3 md:flex-row md:items-center md:justify-between`, heading `text-2xl sm:text-3xl md:text-4xl`, button row `w-full md:w-auto justify-end`.
- Root container → `px-4 py-4 sm:p-6 pb-24 md:pb-6` (bottom nav clearance).
- Tabs → `grid-cols-2 sm:grid-cols-4`, tab labels `text-xs sm:text-sm`.
- Stat numbers → `text-3xl`, add `truncate` on recent quiz topic.
- Charts grid → already `lg:grid-cols-3` / `lg:grid-cols-2`, but force `min-w-0` on children so Recharts doesn't push overflow.

Also check `StreakCounter`, `SkillRadarChart`, `PerformanceTrendChart`, `StudyHeatmap` for any fixed widths and wrap them in `min-w-0 overflow-hidden` containers if needed.

---

## Phase B — Make Placement Prep genuinely useful (daily-driver)

Today it's a **static page** with hardcoded `todaysPlan` and localStorage-only checkboxes. That's not enough for real students. Upgrade plan:

### B1. Daily-rotating plan (not the same 3 tasks every day)
- Add a deterministic `getTodaysPlan(branch, dateString)` in `placementData.ts` that rotates through a pool of 30+ tasks per branch (DSA pattern of the day, core subject MCQs, aptitude drill, mock, soft-skill prompt).
- Each day shows a fresh, themed mix (e.g. "Monday = DSA + DBMS", "Tuesday = OS + Aptitude").

### B2. Real streak tracking (not "0 / 🔥 1")
- New localStorage key `crackit_placement_streak_{branch}` storing `{ lastCompletedDate, currentStreak, longestStreak, completionLog: [dates] }`.
- When all today's tasks are checked → increment streak, write today's date.
- Show **current streak, longest streak, last-7-days dot calendar** in the side column.

### B3. Wire it to Supabase (so progress survives across devices)
New table:
```
public.placement_progress(
  user_id uuid, branch text, date date,
  tasks_done jsonb, completed boolean,
  PRIMARY KEY (user_id, branch, date)
)
```
+ RLS (user can read/write only own rows) + GRANTs.
Hook: `usePlacementProgress(branch)` — reads/writes via Supabase when logged in, falls back to localStorage when not.

### B4. Useful additions for real students
- **"Why this matters" mini-blurb per task** (1 line — e.g. "Sliding window shows up in 30% of FAANG screens").
- **Resource links per subject** — open a drawer with 2 YouTube videos + 1 cheatsheet (reuse existing `VideoModal`).
- **Mock-test launcher** — replace "Daily 10-MCQ" placeholder with a real call to `/quiz/:topicId` using the branch's rotated topic of the day.
- **Resume score widget** — checklist becomes interactive: tick items → see a 0–100 readiness score.
- **Company-target picker** — student picks 3 dream companies; we surface that company's `companyData` priority topics inline.
- **Today's HR question** — 1 rotating question with a textarea ("Practice answer") saved locally so they actually rehearse.
- **Weekly review card** (Sunday): shows hours done, tasks completed, streak — and 1 AI-style nudge.

### B5. Make landing branch picker more useful
- Add **"What you'll get"** bullet list under each branch card (5 short outcomes).
- Add an **"I'm in Year ___" selector** (2nd / pre-final / final) → adjusts intensity ("3 tasks/day" vs "5 tasks/day").
- Add **trust strip**: "Used by 1,200+ B.Tech students" (static social proof for now).

### B6. Mobile polish for `/placement-prep/:branch`
- Sticky top compact "Today's progress" bar on mobile (collapses streak + %).
- Side column becomes a **stacked tabbed accordion** below main content on mobile, not 3-col grid.
- Add `pb-24` on the page root for bottom-nav clearance.

---

## Phase C — Small polish pass
1. **Bottom-nav clearance** audit — add `pb-[calc(env(safe-area-inset-bottom)+64px)] md:pb-0` helper class globally to pages that overlap (`UPSC`, `PlacementPrep`, `Dashboard`, `Companies`).
2. **Topics grid on mobile** — already 1-col, fine. Verify spacing.
3. **Placement nav entry** — add "Placement" to `MobileBottomNav` (replace `UPSC` slot with a "Prep" hub that shows both UPSC + Placement) — OR keep both, ask user before changing.

---

## Technical details (for review)

**Files to edit:**
- `src/components/dashboard/SimpleDashboard.tsx` (mobile fixes)
- `src/pages/PlacementPrep.tsx` (rewrite layout + wire to new hook)
- `src/data/placementData.ts` (add task pool, rotation helper, year-of-study intensities)

**Files to create:**
- `src/hooks/usePlacementProgress.ts` — streak + tasks + Supabase sync
- `src/components/placement/StreakWidget.tsx`
- `src/components/placement/TodaysPlanCard.tsx`
- `src/components/placement/ResumeScoreCard.tsx`
- `src/components/placement/HRPracticeCard.tsx`

**Migration:**
- `placement_progress` table + RLS policies (`user_id = auth.uid()`) + GRANTs to `authenticated` + `service_role`.

**No new dependencies needed.** Everything uses existing shadcn + framer-motion + Supabase.

---

## Open question before I build

Want me to **ship all three phases in one go**, or split into:
- **PR1 — Dashboard mobile fix only** (fast, ~10 min of changes), then
- **PR2 — Placement Prep upgrade** (bigger, includes the Supabase migration)?

Splitting lets you verify the dashboard fix on your phone before I touch the bigger placement work.

# Plan: Placement Prep Module + Intro Animation Fixes

## Part 1 — Fix the Intro Animation

### Root cause of "showing twice"

`LogoAnimation` is mounted in **two places**:

1. `src/App.tsx` (lines 70–84) — runs on every refresh, gates the whole app.
2. `src/pages/Index.tsx` — also renders it via sessionStorage flag.

So on a hard refresh of `/`, you see App's intro, then Index's intro again.

### Fix

- Remove the intro entirely from `App.tsx` (delete the `showAnimation` state + early return + import).
- Keep it only in `Index.tsx`, gated by `sessionStorage` so it shows once per session.
- Rework `LogoAnimation.tsx` for mobile:
  - Use `clamp()`/responsive Tailwind sizes so orb, wordmark, and tagline scale down cleanly on small screens (≤375 px).
  - Add `100dvh` + `overflow-hidden` on `html/body` while active (fixes iOS address-bar jump).
  - Reduce orb from `w-28` to `w-20` on mobile; tighten vertical gaps.
  - Shorten total duration to ~1800 ms on mobile (faster perceived load).
  - Respect `prefers-reduced-motion` — skip crack-draw + ring pulse, just fade.

---

## Part 2 — Placement Prep Section (B.Tech: CSE & ECE)

A dedicated journey that picks up where Topics/Companies leave off, focused on **daily consistency + branch-specific roadmap**.

### 2.1 User flow

```text
/placement-prep
  └─ Branch selector (one-time, saved to profile)
        ├─ CSE  →  /placement-prep/cse
        └─ ECE  →  /placement-prep/ece
              ├─ Roadmap (weekly milestones)
              ├─ Today's Plan (daily tasks)
              ├─ Mock Tests (branch-specific)
              ├─ Resume & HR Kit
              └─ Progress + Streak
```

Branch choice stored in `profiles.placement_branch` (`'cse' | 'ece' | null`). Switchable from a settings tab.

### 2.2 Page sections

**Landing (`/placement-prep`)**

- Hero: "Your branch. Your roadmap. Daily wins." + branch picker cards (CSE / ECE) with icon, short pitch, "Start Track" CTA.
- Stats strip: companies covered, alumni placed, avg package.
- "Why daily consistency" explainer with a 90-day calendar visual.

**Branch Dashboard (`/placement-prep/:branch`)**

1. **Today's Plan card** — 3–5 tasks auto-generated for the day (1 DSA / aptitude / core subject / mock MCQ / soft-skill nudge). Checkbox-based, drives the streak.
2. **Roadmap timeline** — phased plan:
  - CSE: Foundations → DSA → CS Core (OS/DBMS/CN/OOP) → System Design lite → Aptitude → Mock Interviews → Company-specific.
  - ECE: Foundations → Aptitude → Core (Digital, Analog, Signals, EMFT, Comm.) → Embedded/VLSI/Networking electives → DSA basics → Mock Interviews → Company-specific (TCS, Infosys, Wipro, L&T, Qualcomm, Texas Instruments, Intel, Bosch, ISRO/DRDO PSU).
3. **Subject grid** — branch-specific cards linking to existing Topics/quizzes (reuse `TopicCard`).
4. **Mock Test Center** — short daily MCQ (10 Q / 10 min), weekly full-length (50 Q / 60 min), company-tagged sets.
5. **Resume + HR Kit** — checklist of resume sections, branch-specific project ideas, sample HR Qs (read-only; the existing HR Interview AI stays disabled per memory).
6. **Progress panel** — streak counter, weekly completion %, skill radar (reuse `SkillRadarChart`), badges earned.
7. **Daily reminder** — opt-in browser notification + email at chosen time.

### 2.3 Data model (Supabase)

New tables (all with RLS + grants per project rules):

- `placement_tracks` — seed data: `id, branch, phase_order, title, description, est_days`.
- `placement_tasks` — seed data: `id, track_id, day_offset, type ('dsa'|'core'|'aptitude'|'mock'|'soft'), title, ref_topic_id, est_minutes`.
- `user_placement_progress` — `user_id, task_id, completed_at, score`.
- `profiles.placement_branch` — new column.

Server-side `get_today_plan(user_id)` RPC (SECURITY DEFINER) computes the day's tasks from start date + completed history.

### 2.4 Navigation & entry points

- Add **"Placement Prep"** link in `Navbar` (desktop) and `MobileBottomNav` (replace one less-used icon, e.g. swap "Topics" with "Placement" and move Topics into the sheet menu — confirm with you).
- Add a feature card on Home (`/`) between Topics and Companies sections.
- Dashboard widget: "Continue your placement track — Day X of 90".

### 2.5 Build phases

1. **Phase A (animation fix)** — small, ~1 file delete + LogoAnimation mobile polish.
2. **Phase B (UI shell)** — `/placement-prep` landing + branch picker + static roadmap (mocked data) for both branches.
3. **Phase C (backend)** — migrations, seed tracks/tasks, RPC, progress writes.
4. **Phase D (daily plan + streak + dashboard widget + nav entry)**.
5. **Phase E (mock test center + resume kit + reminders)**.

---

## Questions before I build

1. **Nav slot**: OK to replace "Topics" in the mobile bottom nav with "Placement" and keep Topics in the sheet menu? Or add Placement as a 6th item?
2. **Scope of Phase 1**: Want me to ship **Phase A + Phase B (UI only with mock data)** first so you can review the look, then wire backend? Or full Phase A–D in one go?
3. **Branches**: Only CSE + ECE now, or should I also stub IT / EEE / Mech for later?
4. **Daily plan length**: 3 tasks (30 min/day) or 5 tasks (60 min/day) as the default?
  &nbsp;
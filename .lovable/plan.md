# Making CrackIt Indispensable

## Why students currently leave for W3Schools / GFG

| They go there for | We currently offer | Gap |
|---|---|---|
| Reference & syntax lookup | Quizzes only | No quick lookup |
| "What do I study today?" | Long topic lists | No daily push |
| Practice problems | Quizzes, not coding | No code runner |
| Company-wise questions | Static company pages | Not personalized |
| Peer validation | Leaderboard exists | Not contextual |

GFG/W3Schools are **encyclopedias**. CrackIt should be a **coach** — knows the student, picks the next move, holds them accountable, and ends in a job.

## The 5 "magic" pillars to add

### 1. Daily Mission (the hook)
A single card on Dashboard + Home: *"Your 15-min mission today"* — 1 concept card + 5 MCQs + 1 coding snippet, picked from the student's weakest topic (we already track accuracy per topic). Streak + XP attached.
**Why unique:** GFG shows you 10,000 articles. We show you the *one* thing to do right now.

### 2. Weakness Radar → Auto-Remediation
After every quiz, instead of just a score, surface: *"You're 42% on Pointers. Here's a 5-min explainer + 3 targeted questions."* One-click "Fix this weakness" flow. Uses existing `useAdaptiveDifficulty` + Gemini.
**Why unique:** GFG ends at the article. We close the loop.

### 3. Concept Cards (the "lookup" replacement)
A new lightweight `/learn/:topic` route — short, scannable concept cards (definition → example → gotcha → 1 MCQ). Searchable from the navbar (Cmd/Ctrl-K). Replaces the need to leave for W3Schools to "just check syntax."
**Why unique:** Every card ends in a micro-quiz, so reading converts to retention.

### 4. Placement Countdown + Accountability
Top-of-dashboard banner: *"TCS NQT in 47 days · You're 61% ready · 3 weak areas left."* Pulled from existing placement progress + target companies. Weekly email/in-app nudge if streak breaks.
**Why unique:** GFG doesn't know your placement date. We do.

### 5. Peer Pulse (social proof, contextual)
On every topic page: *"312 students from your branch attempted this week · top scorer: 92%."* On quiz results: *"You beat 68% of CSE students."*
**Why unique:** Anonymous, branch-scoped social proof — pressure without toxicity.

## Quality & simplicity passes (parallel)

- **Home page rewrite**: replace generic "Master Tech" hero with the one-liner promise *"The only prep app that tells you exactly what to study today."* + live demo of Daily Mission.
- **Navbar Cmd-K search**: instant jump to any topic / concept / company.
- **Reduce cognitive load**: collapse Dashboard tabs from 4 → 2 (Today, Progress). Achievements move to profile.
- **Empty states**: every blank screen gets a "do this next" CTA instead of "no data."
- **Mobile polish**: Daily Mission card is the first thing on mobile, above stats grid.

## Scope of this implementation

To keep this shippable in one pass, **Phase 1** delivers the differentiators with the highest perceived magic:

1. **Daily Mission card** (Dashboard + Home) — picks weakest topic, generates a 3-step mission, streak-aware.
2. **Weakness Radar panel** on quiz results — one-click remediation flow.
3. **Concept Cards** route `/learn/:topicId` with Cmd-K search in Navbar.
4. **Placement Countdown banner** on Dashboard (uses existing placement data + a date the user sets).
5. **Peer Pulse stat strip** on topic + quiz-result pages (real counts from Supabase, branch-scoped).
6. **Home hero rewrite** + simplified Dashboard tabs (Today / Progress only).

Phase 2 (later, if you approve): email nudges, full content library of concept cards, social peer challenges.

## Technical notes

- **Daily Mission**: new `useDailyMission(userId)` hook → reads `user_performance` for lowest-accuracy topic, deterministically picks 5 questions seeded by `YYYY-MM-DD + userId`. New component `DailyMissionCard.tsx`.
- **Weakness Radar**: extend `SimpleQuizResults` with a `<WeaknessRadar />` block; reuses `aiRecommendationsService`.
- **Concept Cards**: new `src/data/conceptCards.ts` (seed with ~30 cards for top topics), `src/pages/Learn.tsx`, route added in `App.tsx`. Cmd-K via `cmdk` (already in shadcn `command.tsx`).
- **Placement Countdown**: extend `usePlacementProgress` with `targetDate` (localStorage). New `PlacementCountdownBanner.tsx` on Dashboard.
- **Peer Pulse**: new Supabase view/RPC `get_topic_pulse(topic_id, branch)` returning `attempts_this_week, top_score`. Component `PeerPulseStrip.tsx`. SECURITY DEFINER, branch read from `profiles`.
- **Home rewrite**: edit `HeroSection.tsx` + add `DailyMissionPreview` for logged-in users.
- **Dashboard tab collapse**: edit `SimpleDashboard.tsx` — merge Overview+Resources into Today, Progress+Achievements stay separate (Achievements link out to existing `/achievements`).
- All new colors use existing semantic tokens (no hard-coded HSL).
- No new dependencies needed.

## Files touched (estimate)

Created: `useDailyMission.ts`, `DailyMissionCard.tsx`, `WeaknessRadar.tsx`, `PlacementCountdownBanner.tsx`, `PeerPulseStrip.tsx`, `conceptCards.ts`, `Learn.tsx`, `CommandPalette.tsx`, 1 Supabase migration for `get_topic_pulse` RPC.
Edited: `SimpleDashboard.tsx`, `HeroSection.tsx`, `Navbar.tsx`, `App.tsx`, `SimpleQuizResults.tsx`, `usePlacementProgress.ts`, `index.html` (meta).

---

**Approve to build Phase 1**, or tell me which of the 5 pillars to drop/reorder.
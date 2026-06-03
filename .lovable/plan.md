# CrackIt — Multi-phase Upgrade Plan

A phased rollout. Each phase ships independently so you can review before the next.

---

## Phase 1 — CrackIt Branding & Lovable Cleanup

**What "Lovable" actually exists in the project today** (so expectations are clear):
- `public/favicon.ico` → default Lovable icon (will be replaced).
- `index.html` → `https://cdn.gpteng.co/gptengineer.js` script. **Required by Lovable runtime — must stay**, otherwise the editor preview breaks.
- URLs like `https://crackit-prep-rocket.lovable.app/...` in canonical / OG tags. **This is your hosting subdomain**, not branding. It only goes away when you connect a custom domain (e.g. `crackit.in`). I'll keep these working but document how to swap them when you buy a domain.
- No "Made with Lovable" badge in the UI — already clean.
- Navbar / LogoAnimation already say "CrackIt", but use a generic spark/orb icon.

**Work:**
1. **Generate a CrackIt logo set** (premium imagegen): icon mark (transparent PNG), wordmark, favicon (32/180/512), and a 1200×630 OG image. Dark theme + purple accent to match design system.
2. Wire it everywhere:
   - `public/favicon.png` (delete old `.ico`) + `index.html` `<link rel="icon">` + `apple-touch-icon` + `og:image`.
   - New `<Logo />` component used in `Navbar`, `Footer`, `LogoAnimation`, auth pages.
3. Add a `SITE_URL` constant so every canonical/OG URL reads from one place — flipping to a custom domain becomes a 1-line change.

---

## Phase 2 — Company Logos Fix

**Problem:** `CompaniesList.tsx` uses Wikipedia/brandlogos hotlinks. Many 404, render off-color on dark bg, or have inconsistent sizes.

**Fix:**
1. Replace hotlinks with **locally hosted SVG/PNG logos** in `src/assets/companies/` (uploaded via lovable-assets so the repo stays light).
2. Create a `<CompanyLogo name="..." />` component: white-tinted background tile, consistent 48×48 render box, automatic dark-mode contrast for monochrome logos (Apple, Adobe etc.).
3. Standardize the 9 existing companies (Infosys, TCS, Wipro, Accenture, Cognizant, IBM, Amazon, Microsoft, Google) and add 6 more high-demand ones: **Capgemini, HCL, Tech Mahindra, Deloitte, Flipkart, Zoho**.
4. Update `CompaniesSection` (home) to use the same component.

---

## Phase 3 — Stripe Payments (Built-in, ₹500/year Pro)

**Pricing model confirmed:** single yearly plan, **₹500/year**.

I recommend keeping a tiny Free tier so the funnel still works:
- **Free:** 3 quizzes/day, basic dashboard, no AI tutor.
- **Pro — ₹500/year:** unlimited quizzes, AI Tutor, full Placement Prep, company mock tests, certificates, priority leaderboard badge.

**Work:**
1. Enable Lovable's built-in Stripe (`enable_stripe_payments`) — no API keys needed, test mode immediately.
2. Create the Pro ₹500/yr product via `batch_create_product` (tax option: calculation only — Indian GST handled by you for now; we can upgrade later).
3. Build a Pricing page redesign with one big "Go Pro" card + comparison table.
4. Checkout flow: "Upgrade" button → Stripe Checkout session (edge function) → webhook updates `profiles.is_pro` + `pro_expires_at`.
5. Add a `useProAccess()` hook + `<ProGate>` wrapper to lock premium features.
6. "Manage subscription" link in user profile → Stripe customer portal.

---

## Phase 4 — Daily-Use Engagement Engine

Goal: students open CrackIt **every day**. The mechanics that drive that:

1. **Daily Streak v2** — visible in navbar, breaks at midnight IST, freeze tokens earned by 7-day streaks.
2. **Daily Goal** — 1 quiz + 1 placement task + 5 min AI Tutor. Progress ring on dashboard.
3. **Today's Mission card** on Index + Dashboard: 1 quiz, 1 concept, 1 mock question — auto-rotated.
4. **Push-style reminders** — browser Notification API at user-chosen time ("Your 10-min mission is ready").
5. **Daily leaderboard** (already exists) — surface "you moved up 4 ranks today" toast at login.
6. **Email digest** (Lovable Email) — weekly Monday summary: streak, accuracy delta, next week's plan.
7. **Mini quizzes (60-sec format)** — quick 5-Q sprints for commute/break-time use.

---

## Phase 5 — Section-by-Section Polish

Walk every public section and bring it to "top ed-tech" bar:

| Section | Upgrade |
|---|---|
| Hero | Replace generic illustration with animated CrackIt mascot; add live stats (users, quizzes attempted, avg score) |
| Topics | Add difficulty filter chips, "Start in 30s" CTA, completion rings on cards |
| Companies | Phase 2 fixes + add "Salary insights", "Recent interview experiences" tab per company |
| Placement Prep | Wire to Supabase (Phase 4 prerequisite): persist progress per-branch, add weekly review modal |
| UPSC | Add daily current-affairs card + PYQ-of-the-day |
| Resources | Tag every resource Free/Pro; AI-curated "for you" rail per topic |
| Leaderboard | Add filter by college/branch; weekly rewards (Pro coupon for top 3) |
| Dashboard | Add "What to study next" AI block, weak-topic alerts, study-time heatmap export |
| AI Tutor | Persistent chat history, code blocks, voice input (Pro) |
| Profile | Public share link, downloadable progress certificate, GitHub-style activity grid |
| Footer | Real social links, contact email, app store badges (placeholder until apps ship) |

---

## Suggested ship order

```text
Phase 1  ─ Branding (½ day)
Phase 2  ─ Company logos (½ day)
Phase 3  ─ Stripe + Pricing (1 day, requires Pro Lovable plan)
Phase 4  ─ Daily engagement (1–2 days, needs Supabase migrations)
Phase 5  ─ Section polish (rolled out section-by-section over multiple sessions)
```

---

## Technical notes
- New tables in Phase 3: extend `profiles` with `is_pro boolean`, `pro_expires_at timestamptz`, `stripe_customer_id text`.
- New tables in Phase 4: `daily_missions`, `user_mission_progress`, `notification_prefs`.
- Edge functions: `create-checkout`, `stripe-webhook`, `send-weekly-digest`.
- All premium gating server-side (RLS + edge functions) — never client-only.
- `SITE_URL` constant in `src/config/site.ts` to centralize the canonical domain.

---

## What I need from you to start Phase 1
- Confirm logo direction: **dark + purple "cracked-orb / rocket" mark** with "CrackIt" wordmark in display font? Or do you want a different metaphor (lightbulb, cracked code, etc.)?
- OK to delete `public/favicon.ico` and replace with PNG set?

Reply "go" and I'll start with Phase 1.

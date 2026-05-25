# Plan: Premium AI Redesign — Midnight Indigo, Subtle & Refined

## Direction (locked from your picks)

- **Palette**: Midnight Indigo — deep navy `#0a0a1a` / `#141432` surfaces, `#1e1e5a` borders, `#4f46e5` electric indigo as the single bold accent. Soft `#a5b4fc` highlights for AI/glow moments.
- **Typography**: Display in **Space Grotesk** (tight, modern, slight tech feel), body in **Inter**. Both via `display=swap`.
- **Motion register**: Subtle — fades, micro-scales, gentle parallax glows. No particle storms.
- **AI cues**: thin indigo glow rings, "AI"-pill badges with a pulsing dot, dotted-grid background at very low opacity, animated typewriter on the hero headline only.

## What changes (full site)

### 1. Design system foundation
- Rewrite `src/index.css` tokens to the Midnight Indigo palette (HSL only).
- Add gradient + shadow tokens: `--gradient-indigo`, `--gradient-aurora-subtle`, `--shadow-glow`, `--shadow-elevated`.
- Add Space Grotesk to the Google Fonts import, set `--font-display` / `--font-body`, wire into `tailwind.config.ts`.
- Add a `bg-grid-soft` utility (low-opacity dotted grid) for hero/section backdrops.

### 2. Global chrome
- **Navbar**: glass with `backdrop-blur`, hairline indigo border, active link underline animation, "AI" pill next to the logo.
- **Footer**: refined dark grid, gradient brand mark, link hover glow.
- **MobileBottomNav**: same dark glass treatment.

### 3. Landing page (`/`)
- **Hero**: new `TypewriterHeadline` that cycles "Know it.", "Crack it.", "Ace it.", "AI-level it." after the static line; subtle indigo glow orb behind; dotted-grid backdrop; refined dual CTA.
- **QuizPreview**: glass card, indigo accent for the active option, "AI-graded" micro-badge.
- **TopicsSection / CompaniesSection**: cards get the new glass + glow-on-hover treatment, consistent radius/spacing.
- Replace both CTA bands with a single, calmer "Ready to crack your next interview" section in the new palette.

### 4. Product pages (UPSC, Companies, Resources, Topics, Achievements, Leaderboard, Pricing, Features, About, FAQ, Contact, Blog, Study Guides, AI Tutor, Support, Privacy/Terms/Cookies, Careers)
- Swap the per-page orange/green/purple tints for the unified Midnight Indigo system.
- Section headers: small uppercase eyebrow + display heading + muted subhead pattern, applied consistently.
- Cards: unified `GlassCard` look (border `--border`, subtle inner glow, hover lift).
- Buttons: refresh `buttonVariants` with `default`, `outline`, `ghost`, and a new `premium` variant (indigo gradient + soft glow).

### 5. Dashboard + Quiz flow
- Dashboard: unified card surfaces, refined stat tiles, badge displays in the new palette.
- Quiz screens (intro, question, results): calmer typography, indigo correctness states (success/danger tokens kept semantic), subtle progress glow.

### 6. New AI hero feature
- `TypewriterHeadline` component (custom hook, no extra deps) used only in the landing hero.
- Reduced-motion respected via `prefers-reduced-motion`.

## Out of scope (won't change)
- Routing, auth, data fetching, Supabase schema, badge logic.
- The AI Tutor backend, quiz generation logic, leaderboard sync.
- No new pages, no new features beyond the typewriter headline.

## Technical notes
- All colors as HSL in `index.css`; components use semantic Tailwind tokens (`bg-background`, `text-foreground`, `bg-primary`, `border-border`, etc.). No raw hex in components.
- Keep `framer-motion` (already installed); no new animation libraries.
- Keep existing SEO/Helmet work intact.
- Files touched (high level): `src/index.css`, `tailwind.config.ts`, `src/components/ui/button.tsx`, `src/components/Navbar.tsx`, `src/components/Footer.tsx`, `src/components/MobileBottomNav.tsx`, all `src/pages/*.tsx`, hero/topics/companies sections, dashboard widgets, quiz components, UPSC subcomponents. New: `src/components/common/TypewriterHeadline.tsx`.

## Rollout
1. Tokens + fonts + button variants (foundation).
2. Navbar + Footer + landing hero (immediate visual lift).
3. Landing sections + product pages.
4. Dashboard + quiz flow.
5. QA pass on mobile (1202px down to 360px).

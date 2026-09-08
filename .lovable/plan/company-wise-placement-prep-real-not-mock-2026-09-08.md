# Company-Wise Placement Prep (Real, Not Mock)

## What you asked for

A Placement Prep section where each company has its own preparation track — questions and details that match that company's actual hiring style, not one generic pool.

## One important note on IndiaBix

We cannot copy questions from IndiaBix. Their question bank is copyrighted content and scraping it would expose CrackIt to takedown notices and would block any future monetisation. What we can legally do — and what actually produces better material — is use IndiaBix-style *patterns* (section names, timings, difficulty mix, question archetypes that are public knowledge) and generate original questions in that exact shape with AI. Every question is then stored permanently in your database, so students get a real, growing bank, never throwaway mock data.

## The model

Each of the first 6 companies gets a full "Test Blueprint" describing how that company actually hires:

| Company | Test style captured |
|---|---|
| TCS | NQT: Numerical, Verbal, Reasoning, Programming Logic, Coding — adaptive, section-locked |
| Infosys | Reasoning-heavy, Pseudocode, Puzzle Solving, no negative marking |
| Wipro | Elite NTH: Aptitude, English, Coding, plus Written Communication essay |
| Accenture | Cognitive + Technical + Coding, with Communication assessment |
| Cognizant | GenC: Aptitude, Logical, Verbal, Automata Fix coding |
| Capgemini | Game-based aptitude, Pseudocode, English comprehension, Behavioural |

Each blueprint stores: section list, questions per section, minutes per section, difficulty mix, cut-off, negative marking, and the archetypes of question that show up.

## What a student sees

For a company page, two tabs:

1. **Practice** — pick a section (e.g. "Pseudocode"), get untimed questions with explanations after each answer. Learn mode.
2. **Full Mock Test** — the real thing: sections in order, real timers, real cut-off, no explanations until the end, then a section-wise scorecard showing where they'd have been rejected and what to fix.

Plus a per-company readiness score built from their real section accuracy, and a "next weakest section" nudge.

## Where the questions come from

- Question generation runs per company **and** per section, using the blueprint as the prompt context — so a TCS "Programming Logic" question genuinely looks different from an Infosys "Pseudocode" one.
- Generated questions are **saved to the database**, tagged with company + section + difficulty. Nothing is regenerated on every visit.
- A student never sees the same question twice until the bank for that section is exhausted.
- Questions carry an explanation and a difficulty rating; duplicates are rejected on save by comparing question text.

## Technical notes

**Database (new tables)**
- `company_blueprints` — company id, display name, sections config (JSON), cut-off, negative marking, total duration. Publicly readable.
- `company_questions` — company id, section, question text, options, correct answer, explanation, difficulty, times served, times answered correctly. Publicly readable; only the server writes.
- `company_mock_attempts` — user id, company id, mode (practice/mock), section scores (JSON), total score, passed cut-off flag, time taken. Owner-only access.
- `company_seen_questions` — user id, question id, so repeats are avoided. Owner-only.
All tables get explicit grants plus row-level security scoped to `auth.uid()` where user-owned.

**Edge functions**
- `generate-company-questions` — takes company + section + count, loads the blueprint, calls Lovable AI (`openai/gpt-6-astra` via the Responses API, streaming) with a strict JSON schema, dedupes against existing rows, inserts. Runs on demand when a section's bank drops below a threshold, so the bank grows by itself as students use it.
- `serve-company-questions` — returns questions for a section *without* the correct answers (mirroring the existing `get_secure_quiz_questions` approach), excluding ones the student already saw.
- Answer checking reuses the existing server-side validation pattern so answers never reach the browser.

**Frontend**
- `src/data/companyBlueprints.ts` — the 6 blueprints, typed.
- `src/pages/CompanyPrep.tsx` at `/placement-prep/company/:companyId` with Practice / Mock tabs.
- `src/components/placement/` — `SectionPicker`, `MockTestRunner` (section timer + auto-advance), `SectionScorecard`, `CompanyReadinessCard`.
- Company cards in Placement Prep and the existing Companies pages link into this.
- Mobile-first: one question per screen, sticky timer, 44px tap targets, bottom-nav clearance.

**Seeding**
Before launch I run a seeding pass so every section of all 6 companies starts with a real bank (roughly 40–60 questions per section) — students never hit an empty section.

## Build order

1. Database tables + access rules
2. Blueprints for the 6 companies
3. Generation + serving edge functions, then seed the banks
4. Practice mode UI
5. Full mock test runner + scorecard
6. Readiness score + wiring into Placement Prep and Companies pages

## Options worth adding later (my recommendations, ranked)

1. **Coding round with a real code editor** — the biggest gap vs. HackerRank; run test cases in-browser for TCS/Wipro/Cognizant coding sections.
2. **Company cut-off predictor** — "you scored 62%, TCS cut-off is ~70% — here are the 3 sections costing you the marks."
3. **Timed daily company drill** — 10 questions from your target company every morning, feeding the existing streak system.
4. **Interview experience feed** — students submit what they were actually asked; moderated, and it feeds back into question generation. This is the moat IndiaBix doesn't have.
5. **Company vs. you comparison** — percentile against everyone else prepping for the same company, using the existing leaderboard.
6. **Resume-to-company fit check** — upload resume, get eligibility and gap analysis per company.

Say the word and I'll fold any of these into the build.

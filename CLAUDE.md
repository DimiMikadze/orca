# Orca

Orca is an agentic AI system that analyzes LinkedIn profiles and the people they engage with to understand how they actually behave and what they care about. You choose what you want to learn, and Orca analyzes posts, comments, reactions, and interactions to uncover insights like pain points, current focus, values, expertise, influence, and how interests change over time.

## Project Structure

**orca-ai/** - AI library (treated as standalone, zero Next.js dependencies)

- `agents/` - Analysis agent
- `orchestrator/` - Pipeline coordination
- `services/` - External API integrations (LinkedIn scrapers)
- `types.ts` - Shared types
- `index.ts` - Public API surface

**app/** - Next.js 16 frontend that imports from orca-ai

## Architecture

Single-agent system. `collectLinkedInData` scrapes baseline data (profile, posts, comments, reactions, top post engagement — ~11 API credits, no LLM), then the Analysis Agent processes it to extract structured insights. The agent has scraping tools so it can autonomously gather more data if needed.

**Preventing duplicate scraping:** The agent must never re-fetch data already collected in baseline — it wastes credits and returns no new information. Two mechanisms enforce this:

- `scrape_more_activity`: `collectLinkedInData` stores the pagination token from each baseline activity page in `activityPaginationTokens`. The tool uses this token with `startFrom=50` to start at page 2, making it structurally impossible to re-fetch page 1.
- `scrape_post_comments` / `scrape_post_reactions`: comments and reactions for top posts are already collected in baseline. The agent caches them in a `Map` (keyed by URN) before tools run — any call for an already-collected URN returns cached data without an API call.

- orca-ai is a library folder within the Next.js project but cannot import from app. Dependencies flow one way: app → orca-ai.
- External APIs abstracted behind interface contracts in services/, never hardcoded.

## Insights

The analysis agent takes an array of `InsightDefinition` (`{ name, description }`) as a parameter, making insights configurable without code changes. `DEFAULT_INSIGHTS` in `orca-ai/constants.ts` defines the 10 default categories:

- Pain points - Problems they complain about, challenges they mention, frustrations in posts and comments
- Current focus - Topics dominating their recent activity, what they're actively working on or thinking about
- Values - What they consistently defend, celebrate, or push back on
- Network influence - Who they engage with most, who engages with them, mutual relationships vs one-way
- Expertise - Topics where they demonstrate real depth (detailed posts, nuanced comments) vs surface-level mentions
- Communication style - How they communicate: long vs short posts, questions vs statements, data vs stories, technical vs accessible, formal vs casual
- Hidden interests - What their reactions reveal that their posts don't. People curate posts but react instinctively
- Beyond the bio - Gap between their stated identity (headline, about, job title) and where they actually spend their attention
- What resonates - Their highest-engagement content vs lowest. What their audience responds to vs what falls flat
- Topic evolution - How their interests have shifted over time. What they talked about 6 months ago vs now

## Scrapers

All scrapers live in `orca-ai/services/` and use the RapidAPI Fresh LinkedIn Profile Data API (`RAPIDAPI_KEY` in `.env.local`).

- `linkedin-profile-scraper.ts` - `scrapeLinkedInProfile(url)` fetches full profile data (3 credits)
- `linkedin-activity-scraper.ts` - `scrapeLinkedInActivity(url, type, maxPages?)` fetches posts/comments/reactions (2 credits per page, 50 items per page)
- `linkedin-post-comments-scraper.ts` - `scrapePostComments(urn, maxPages?)` fetches comments on a specific post by URN (1 credit per page)
- `linkedin-post-reactions-scraper.ts` - `scrapePostReactions(urn, maxPages?)` fetches reactions on a specific post by URN (1 credit per page)

Types for all API responses are in `orca-ai/types.ts`. All fields are optional since API data availability varies.

## Frontend

`app/profile-analysis/` — main UI for profile analysis flow.

- `ProfileAnalysis.tsx` — page-level component. Owns all state (form, loading, results, modal). Streams SSE from `/api/linkedin-profile`. Has `USE_DUMMY_DATA` flag for dev.
- `ProfileAnalysisResult.tsx` — profile header + insight cards. Contains `RichText` helper that renders markdown links and LinkedIn URLs as clickable labels.
- `CollectedDataModal.tsx` — modal showing raw collected data across tabs: Profile, Posts, Comments, Reactions, Audience Engagements.

## Authentication

Auth is **optional**. If `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set in `.env.local`, the app enables Supabase email/password login and protects all pages and the API route. Without these variables, the app runs with no auth.

- `app/supabase/` — Supabase client helpers (browser, server, proxy)
- `app/login/` — Login page (client-side auth via browser Supabase client)
- `app/components/logout-button.tsx` — Logout button, only renders when auth is configured
- `proxy.ts` — Refreshes session and redirects unauthenticated users to `/login` (only active when env vars are set)
- Each analysis is recorded in the `analysis` Supabase table. `ANALYSIS_CAP` in `app/supabase/orm.ts` sets the per-user limit — users who hit it get a friendly error with a contact email.

## Stack

- TypeScript
- Next.js 16
- Tailwind CSS
- pnpm (package manager)

### File Naming

- Use kebab-case for files: `company-analysis.ts`, `data-merger.ts`
- Use PascalCase for components: `CompanyProgress.tsx`
- Use descriptive names that explain purpose: `linkedin-company-scraper.ts`

### Variable & Function Naming

- Use camelCase: `researchCompany`, `progressCallback`
- Be descriptive: `scrapingBeeClient` not `client`
- Prefer verb-noun for functions: `createProgressReporter`, `mergeDataPoints`
- Use meaningful constants: `PROGRESS_EVENTS`, `DEFAULT_INSIGHTS`

### Code Quality

- Use TypeScript strictly with proper type definitions
- Prefer const over let, avoid var completely
- Keep functions small and focused on single responsibility
- Add JSDoc comments for public APIs and complex logic
- Use meaningful variable names that describe business purpose

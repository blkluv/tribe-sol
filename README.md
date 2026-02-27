# Tribe

Hyperlocal social networking app — connect with your city, join tribes, and engage with your community. Built with Next.js and integrated with Solana for wallet-based identity and the [Tapestry](https://usetapestry.dev) social graph protocol.

Ported from the native SwiftUI iOS app to a responsive web experience.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| UI | React 19, TailwindCSS v4, shadcn/ui, Framer Motion |
| State | Zustand (with persistence middleware) |
| Blockchain | Solana Web3.js, Wallet Adapter (Phantom) |
| Social Graph | [Tapestry Protocol](https://usetapestry.dev) via `socialfi` SDK |
| Theming | next-themes with city-dynamic accent colors |
| Testing | Vitest, Testing Library |

---

## Getting Started

### Prerequisites

- **Node.js** >= 18
- **npm** >= 9
- A **Tapestry API key** — get one at [usetapestry.dev](https://usetapestry.dev)
- A **Solana RPC URL** (public default works, but a dedicated RPC like Helius/Triton is recommended for production)

### 1. Clone and install

```bash
git clone <repo-url>
cd tribe-solana
npm install
```

### 2. Configure environment variables

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

Edit `.env`:

```env
# Required — your Tapestry API key (server-side only, never exposed to client)
TAPESTRY_API_KEY=your-tapestry-api-key

# Optional — Tapestry API base URL (defaults to production inside the SDK)
TAPESTRY_BASE_URL=https://api.usetapestry.dev/v1

# Optional — Solana RPC endpoint (defaults to public mainnet)
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com

# Optional — Solana network: "mainnet-beta" or "devnet"
NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
```

> **Security note:** `TAPESTRY_API_KEY` is a server-side variable — it is only read inside API route handlers and is never shipped to the browser. The `NEXT_PUBLIC_*` variables are safe to expose.

### 3. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The app starts on the onboarding flow — connect a Solana wallet (Phantom) to get started.

### 4. Run tests

```bash
npm run test          # single run
npm run test:watch    # watch mode
```

### 5. Build for production

```bash
npm run build
npm run start
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (Turbopack) |
| `npm run build` | Create optimized production build |
| `npm run start` | Serve production build |
| `npm run lint` | Run ESLint |
| `npm run test` | Run Vitest test suite |
| `npm run test:watch` | Run tests in watch mode |

---

## Deploying to Production

### Vercel (recommended)

1. Push this repo to GitHub/GitLab
2. Import the project on [vercel.com](https://vercel.com)
3. Set environment variables in the Vercel dashboard:
   - `TAPESTRY_API_KEY` — your Tapestry API key
   - `NEXT_PUBLIC_SOLANA_RPC_URL` — a dedicated RPC endpoint (e.g., Helius, Triton, QuickNode)
   - `NEXT_PUBLIC_SOLANA_NETWORK` — `mainnet-beta`
4. Deploy — Vercel auto-detects Next.js and handles the build

### Self-hosted / Docker

```bash
# Build
npm run build

# Start (binds to port 3000 by default)
PORT=3000 npm run start
```

Set the same environment variables above in your hosting environment. The API routes run as serverless functions on Vercel, or as Node.js handlers in self-hosted mode.

### Production checklist

- [ ] Set a **dedicated Solana RPC** — the public `api.mainnet-beta.solana.com` has rate limits
- [ ] Ensure `TAPESTRY_API_KEY` is set as a server-side secret (not prefixed with `NEXT_PUBLIC_`)
- [ ] Configure the `images.remotePatterns` in `next.config.ts` if adding new image domains
- [ ] Set `NODE_ENV=production`

---

## Project Structure

```
src/
├── app/
│   ├── (app)/                # Authenticated routes (bottom nav + sidebar layout)
│   │   ├── home/             # City feed — casts, polls, tasks, crowdfunds, events
│   │   ├── explore/          # Discover events
│   │   ├── tribes/           # Tribe listings and detail pages
│   │   ├── channels/         # Channel detail view
│   │   ├── chat/             # Tribe chat
│   │   ├── create/           # Create new cast
│   │   ├── map/              # City map view
│   │   ├── notifications/    # Activity notifications
│   │   ├── profile/          # User profile with Tapestry social counts
│   │   ├── settings/         # App settings
│   │   └── wallet/           # SOL balance, tips, and wallet management
│   ├── api/                  # Next.js API routes (socialfi SDK layer)
│   │   ├── profiles/         # Profile lookup, creation, detail/update
│   │   ├── followers/        # Follow, unfollow, check follow state
│   │   ├── comments/         # CRUD for comments
│   │   ├── likes/            # Like / unlike content
│   │   ├── search/           # Profile search
│   │   └── content/          # Content CRUD and detail
│   ├── conference/           # Standalone conference page (no app shell)
│   └── onboarding/           # Carousel → city selection → wallet connect → signup
├── components/
│   ├── tribe/                # 22 reusable Tribe UI components
│   ├── features/home/        # Feed cards (cast, poll, task, crowdfund, event)
│   ├── layout/               # App shell, bottom nav, sidebar nav, app header
│   ├── providers/            # Solana wallet + app providers
│   └── ui/                   # 15 shadcn/ui base components
├── hooks/                    # Custom hooks (auth, likes, follows, comments, tips, etc.)
├── store/                    # Zustand stores (tribe, auth, ui, notifications)
├── types/                    # TypeScript type definitions
├── data/                     # Mock data for all features
├── utils/                    # socialfi SDK singleton
└── lib/                      # Utilities, theme config, env config, icons
```

---

## Key Features

- **City-based feeds** — browse casts, polls, tasks, crowdfunds, and events for your city
- **Tribes** — join interest-based groups within your city
- **Solana wallet integration** — connect Phantom wallet, view SOL balance, wallet-based identity
- **Social graph via Tapestry** — on-chain profiles, likes, follows, comments, and content creation
- **SOL tipping** — send SOL tips to cast authors directly from the feed
- **Optimistic UI** — instant feedback on social actions with background sync and rollback on failure
- **Responsive design** — bottom nav on mobile, sidebar on desktop
- **City-dynamic theming** — accent color changes per selected city via CSS custom properties
- **Dark mode** — full dark/light theme support via next-themes

---

## Tapestry Integration

[Tapestry](https://usetapestry.dev) is a social graph protocol that provides decentralized social features (profiles, follows, likes, comments, content) on Solana. We use Tapestry as the backbone for all social interactions in Tribe.

### Architecture

```
┌─────────────────────────────────────────────────────┐
│  Browser (React hooks)                              │
│  useAuth, useFollow, useLike, useComments, etc.     │
│          │                                          │
│          │  fetch("/api/...")                        │
│          ▼                                          │
│  ┌─────────────────────────────────┐                │
│  │  Next.js API Routes             │  Server-side   │
│  │  /api/profiles, /api/likes, ... │                │
│  │          │                      │                │
│  │          │  socialfi SDK        │                │
│  │          ▼                      │                │
│  │  Tapestry API                   │                │
│  │  (api.usetapestry.dev)          │                │
│  └─────────────────────────────────┘                │
└─────────────────────────────────────────────────────┘
```

**How it works:**

1. **Client-side hooks** (`src/hooks/`) call internal API routes via `fetch("/api/...")`
2. **API route handlers** (`src/app/api/`) use the official [`socialfi`](https://www.npmjs.com/package/socialfi) SDK to call the Tapestry API
3. The **`TAPESTRY_API_KEY`** is only accessed server-side inside route handlers — never exposed to the browser
4. **Responses are mapped** from SDK types to our internal `TapestryProfile`, `TapestryComment`, etc. types so component interfaces stay stable

### API Routes

| Route | Methods | Purpose | SDK Methods Used |
|-------|---------|---------|-----------------|
| `/api/profiles` | GET | List profiles by wallet address | `socialfi.profiles.profilesList` |
| `/api/profiles/create` | POST | Find or create a profile | `socialfi.profiles.findOrCreateCreate` |
| `/api/profiles/info` | GET, PUT | Get or update profile details | `socialfi.profiles.profilesDetail`, `profilesUpdate` |
| `/api/followers/add` | POST | Follow a profile | `socialfi.followers.postFollowers` |
| `/api/followers/remove` | POST | Unfollow a profile | `socialfi.followers.removeCreate` |
| `/api/followers/state` | GET | Check if user A follows user B | `socialfi.followers.stateList` |
| `/api/comments` | GET, POST, DELETE | List, create, or delete comments | `socialfi.comments.commentsList`, `commentsCreate`, `commentsDelete` |
| `/api/likes` | POST, DELETE | Like or unlike content | `socialfi.likes.likesCreate`, `likesDelete` |
| `/api/search` | GET | Search profiles by username | `socialfi.search.profilesList` |
| `/api/content` | GET, POST | List or create content | `socialfi.contents.contentsList`, `findOrCreateCreate` |
| `/api/content/[id]` | GET, DELETE | Get or delete content by ID | `socialfi.contents.contentsDetail`, `contentsDelete` |

### Hooks

Each hook encapsulates a Tapestry feature and provides a clean interface to components:

| Hook | File | What it does |
|------|------|-------------|
| `useAuth()` | `src/hooks/use-auth.ts` | Wallet connection + Tapestry profile lookup/creation. Returns `{ status, walletAddress, profile, isAuthenticated, isConnected, createProfile, login, logout }` |
| `useCurrentWallet()` | `src/hooks/use-current-wallet.ts` | Lightweight wallet state + username lookup. Returns `{ walletAddress, isConnected, mainUsername, loading }` |
| `useTapestryProfile(id)` | `src/hooks/use-tapestry-profile.ts` | Fetch a profile's full details (social counts, bio, etc.). Returns `{ profile, isLoading, error, refetch }` |
| `useFollow(targetId)` | `src/hooks/use-follow.ts` | Follow/unfollow with optimistic UI. Returns `{ isFollowing, isLoading, toggleFollow }` |
| `useLike(contentId, initialLiked, initialCount)` | `src/hooks/use-like.ts` | Like/unlike with optimistic count. Returns `{ isLiked, likeCount, isLoading, toggleLike }` |
| `useComments(contentId)` | `src/hooks/use-comments.ts` | Comment CRUD with optimistic delete. Returns `{ comments, total, isLoading, error, fetchComments, addComment, deleteComment }` |
| `useTip()` | `src/hooks/use-tip.ts` | Send SOL tips via Solana transactions. Returns `{ sendTip, isSending, lastSignature, error }` |

### Tapestry Features Used

| Feature | Where in the app | How it works |
|---------|-----------------|-------------|
| **Profile creation** | Onboarding signup | `findOrCreateCreate` links a Solana wallet address to a Tapestry profile with username and bio |
| **Profile lookup** | Wallet connect, profile page | `profilesList` searches by wallet address; `profilesDetail` fetches full profile with social counts |
| **Profile search** | Auth flow | `search.profilesList` finds existing profiles when a wallet connects |
| **Follow / Unfollow** | Follow button on profiles | `postFollowers` / `removeCreate` with optimistic toggle in the UI |
| **Follow state check** | Follow button on mount | `stateList` checks if the current user follows a target profile |
| **Like / Unlike** | Heart button on casts | `likesCreate` / `likesDelete` on content nodes with optimistic count updates |
| **Comments** | Comment sheet on casts | `commentsList` to fetch, `commentsCreate` to add, `commentsDelete` to remove |
| **Content creation** | New cast, poll, task, crowdfund, event | `findOrCreateCreate` persists content to Tapestry with typed properties |
| **Content deletion** | Content management | `contentsDelete` removes content by ID |

### Data Flow Example: Creating a Cast

```
User taps "Post" in /create
       │
       ▼
useTribeStore.addCast(cast)
       │
       ├──► Optimistic: cast appears in feed immediately
       │
       └──► Background: fetch("/api/content", { method: "POST", body: { id, profileId, properties } })
                │
                ▼
            API route: socialfi.contents.findOrCreateCreate({ apiKey }, body)
                │
                ▼
            Tapestry API creates content node on-chain
                │
                ▼
            Response: { id, created_at, namespace }
                │
                ▼
            Store updates cast with tapestryContentId
```

---

## Environment Variables Reference

| Variable | Required | Server/Client | Default | Description |
|----------|----------|---------------|---------|-------------|
| `TAPESTRY_API_KEY` | Yes | Server only | — | API key from [usetapestry.dev](https://usetapestry.dev) |
| `TAPESTRY_BASE_URL` | No | Server only | SDK default | Tapestry API base URL |
| `NEXT_PUBLIC_SOLANA_RPC_URL` | No | Client | `https://api.mainnet-beta.solana.com` | Solana JSON-RPC endpoint |
| `NEXT_PUBLIC_SOLANA_NETWORK` | No | Client | `mainnet-beta` | Solana cluster (`mainnet-beta` or `devnet`) |

---

## Testing

Tests use **Vitest** with **Testing Library** for hook tests. The test suite mocks `fetch` globally to test hooks in isolation without hitting real APIs.

```bash
npm run test          # 65 tests across 5 suites
npm run test:watch    # interactive watch mode
```

Test files are in `src/__tests__/`:

| Test file | What it covers |
|-----------|---------------|
| `auth-store.test.ts` | Zustand auth store (status transitions, persistence, reset) |
| `use-follow.test.ts` | Follow hook (status check, optimistic toggle, rollback, guards) |
| `use-like.test.ts` | Like hook (optimistic update, rollback, loading state, guards) |
| `use-comments.test.ts` | Comments hook (fetch, add, delete, error handling, rollback) |
| `use-tapestry-profile.test.ts` | Profile hook (fetch, error, refetch, profileId changes) |

# Tribe

Hyperlocal social networking app — connect with your city, join tribes, and engage with your community. Built with Next.js and integrated with Solana for wallet-based identity and the Tapestry social graph protocol.

Ported from the native SwiftUI iOS app to a responsive web experience.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **UI:** React 19, TailwindCSS v4, shadcn/ui, Framer Motion
- **State:** Zustand
- **Blockchain:** Solana Web3.js, Wallet Adapter
- **Social Graph:** Tapestry Protocol (likes, follows, comments, casts)
- **Theming:** next-themes with city-dynamic accent colors

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

Create a `.env.local` file:

```env
TAPESTRY_API_KEY=<tapestry-api-key>
TAPESTRY_BASE_URL=https://api.dev.usetapestry.dev/v1
NEXT_PUBLIC_SOLANA_RPC_URL=<solana-rpc-url>
```

## Project Structure

```
src/
├── app/
│   ├── (app)/              # Authenticated routes (bottom nav + sidebar)
│   │   ├── home/           # City feed — casts, polls, tasks, crowdfunds, events
│   │   ├── explore/        # Discover events
│   │   ├── tribes/         # Tribe listings and detail pages
│   │   ├── channels/       # Channel detail view
│   │   ├── chat/           # Tribe chat
│   │   ├── create/         # Create new cast
│   │   ├── map/            # City map view
│   │   ├── notifications/  # Activity notifications
│   │   ├── profile/        # User profile with Tapestry social counts
│   │   ├── settings/       # App settings
│   │   └── wallet/         # SOL balance and wallet management
│   ├── conference/         # Standalone conference page (no app shell)
│   └── onboarding/         # Carousel → city selection → wallet connect → signup
├── components/
│   ├── tribe/              # 22 reusable Tribe UI components
│   ├── features/home/      # Feed cards (cast, poll, task, crowdfund, event)
│   ├── layout/             # App shell, bottom nav, sidebar nav
│   ├── providers/          # Solana wallet + app providers
│   └── ui/                 # 15 shadcn/ui base components
├── hooks/                  # Custom hooks (auth, likes, follows, comments, Tapestry profile)
├── store/                  # Zustand stores (tribe, auth, ui)
├── types/                  # TypeScript type definitions
├── data/                   # Mock data for all features
└── lib/                    # Utilities, Tapestry client, theme config, icons
```

## Key Features

- **City-based feeds** — browse casts, polls, tasks, crowdfunds, and events for your city
- **Tribes** — join interest-based groups within your city
- **Solana wallet integration** — connect wallet, view SOL balance, wallet-based identity
- **Social graph via Tapestry** — on-chain likes, follows, comments, and cast creation
- **Optimistic UI** — instant feedback on social actions with background sync
- **Responsive design** — bottom nav on mobile, sidebar on desktop
- **City-dynamic theming** — accent color changes per selected city
- **Dark mode** — full dark/light theme support

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

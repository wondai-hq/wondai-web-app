# Wondai - AI-Powered Enterprise Messaging Platform

Achievement: 1st Runner Up — TechTO x Penseum Toronto Student Hackathon

## Overview
Wondai is a meaning-first enterprise messaging experience that unifies WhatsApp, Email, Telegram, Slack, Discord, SMS, and voice notes into one inbox. An AI engine called Wanda organizes conversations by intent, urgency, and actionability instead of by channel, so teams work from priorities instead of notifications.

## The problem
- Messages scattered across 7+ channels and devices
- Missed follow-ups that create churn and lost revenue
- Zero cross-channel history or accountability
- Constant context switching and buried urgent items

## The solution
- Single workspace for all channels with people-centric threads
- Wanda AI organizes conversations into Feeds (Urgent, VIP, Follow-Up, Payment Issues, etc.)
- Core hierarchy: Feeds → Threads → Messages with AI-enriched metadata for every layer

## Wanda AI capabilities
- Extracts tasks, follow-ups, deadlines, sentiment, complaint, and payment/risk signals
- Auto-creates and ranks Feeds based on intent and urgency
- Thread summaries, recommended next steps, and “what changed” updates
- Pattern detection for recurring issues and churn indicators

## Product highlights (demo build)
- Marketing landing page with achievement badge, problem/solution narrative, and CTA to start or view demo data
- 4-step onboarding: welcome, channel selection, integration flows (OAuth/API key/complex), and processing with Wanda feed previews
- Demo mode with realistic mock threads/messages across six channels plus feed details and contact merge examples
- Unified inbox (3-column layout) with collapsible sidebar/thread list, meaning-based feeds, and channel-specific views
- Wanda AI panel for summaries, tasks, deadlines, sentiment, and recommended actions
- Expandable action search/command palette (cmdk) for quick actions and navigation
- Contacts and contact summaries with merge/edit modals and recent activity
- Settings views for integrations, SLA dashboard, audit logs, team management, and personal preferences (all powered by mock data)
- Smart filters and feed detail modals showing how intent-based feeds are built

## Tech stack
- React 18 + TypeScript + Vite
- React Router v6 (browser router)
- Tailwind CSS v4 with design tokens in `src/styles/globals.css`
- shadcn/ui (Radix primitives) with `lucide-react` icons
- Recharts for visualization, `cmdk` for action search, `sonner` for toasts
- Local storage helpers for integration selections and layout state
- Frontend-only demo: authentication and data are mocked locally

## Project structure
```
src/
├── App.tsx
├── main.tsx
├── index.css
├── styles/globals.css
├── components/
│   ├── pages/ (Landing, Onboarding, UnifiedInbox, FeedSummary, Contacts, IntegrationsEnhanced, TeamManagement, SLADashboard, SearchResults, NotFound, etc.)
│   ├── ui/ (shadcn/ui primitives)
│   ├── ThreadList.tsx, ThreadView.tsx, AIPanel.tsx, Sidebar.tsx, TopBar.tsx
│   ├── FeedDetailsModal.tsx, CreateFeedModal.tsx, Contact*Modals.tsx
│   ├── ExpandableActionSearch.tsx, ChannelIcon.tsx, ProtectedRoute.tsx
│   └── Root.tsx (layout shell)
├── utils/
│   ├── routes.tsx (router configuration)
│   ├── AuthContext.tsx, LayoutContext.tsx
│   ├── mockData.ts (threads, messages, AI insights, filters, contacts)
│   └── integrations.ts (channel metadata and mock integration state)
├── lib/utils.ts
└── guidelines/Guidelines.md
```

## Getting started
Prerequisites: Node.js 18+ and npm.

```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# Build for production
npm run build
```

Authentication accepts any email/password in this demo. The landing page includes a quick-fill option (`demo@wondai.com` / `demo`) and routes to onboarding and the dashboard.

## Current status
- Complete: landing page, onboarding flow, demo data, unified inbox with AI panel, smart feeds and summaries, action search, contact views, integration management, SLA dashboard, audit logs, and team settings (all mock data).
- In progress: wiring to real backends/APIs, real-time sync, richer mobile responsiveness, and performance tuning for large message volumes.

## Developers
| Name        | GitHub     | Email                    |
| ----------- | ---------- | ------------------------ |
| James Teo   | @twhjames  | jamesteo2701@gmail.com   |
| John-Henry  | @interpause| johnhenrylim12@gmail.com |

## Contact
For questions, demo requests, or partnership inquiries, please contact either of the developers.

## License

Copyright © [2025], [Wondai]. All rights reserved.

The source code in this repository is currently provided for **viewing purposes only**.  
Any usage, reproduction, modification, or distribution of this code, in whole or in part,  
is **not permitted** without prior written consent from [Wondai].

⚠️ The final open-source or commercial license for this project is **to be determined**  
and will be updated in a future release. 

# Caretaker AI — Demo

AI operations assistant for school facilities & estates management. Built with
Next.js (App Router) + Tailwind CSS. This is a **client-facing demo** running on
realistic mock data across 3 schools.

## What's in the demo

- **Operations Dashboard** — portfolio stats, live AI alerts, upcoming
  contractor visits, site health and SLA watch.
- **Schools** — per-site health cards (incidents, overdue tasks, open jobs).
- **Compliance Tracker** — statutory tasks (Fire, Legionella, PAT, Gas,
  Asbestos) with overdue / due-soon / on-track status.
- **Contractor Coordination** — visit schedule, flags visits the site team
  hasn't been notified about.
- **Help Desk & SLA Monitor** — live tickets with SLA breach tracking and
  escalation.
- **AI Assistant** — natural-language copilot grounded in the live data,
  powered by the Google Gemini API.

## Running locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

## AI assistant (Gemini)

The assistant calls the Google Gemini API. To enable real AI responses:

1. Get a key at https://aistudio.google.com/apikey
2. Copy `.env.local.example` to `.env.local` and set `GEMINI_API_KEY`.

**No key needed for the demo** — if the key is missing or the network fails,
the assistant automatically falls back to a built-in scripted responder that
answers the key facilities questions from the live data. It always works.

## Deploying to Vercel

```bash
npm i -g vercel
vercel
```

Add `GEMINI_API_KEY` in the Vercel project's Environment Variables, then
redeploy. You'll get a shareable URL to send the client.

## Data

All demo data lives in [`src/lib/data.ts`](src/lib/data.ts) — schools,
compliance tasks, contractor visits, tickets and alerts. The same module builds
the context string fed to the AI assistant, so the chat and the dashboards
always stay in sync. Swap this file for real data/API calls in production.

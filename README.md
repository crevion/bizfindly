# BizFindly Frontend (Next.js)

AI-powered local discovery for restaurants, resorts and gyms in Bangladesh. This is the Next.js 16 App Router rewrite of the original Vite (TanStack Start) frontend. The design, color palette and feature set are kept 1:1.

## Stack

- **Next.js 16.2** App Router (Turbopack) + React 19.2
- **TypeScript 5** + ESLint 9 flat config (`eslint-config-next` 16)
- **Tailwind CSS v4** via `@tailwindcss/postcss` 4.3
- **Zustand 5** for state, persisted to `localStorage`
- **Lucide React** for icons
- `clsx` + `tailwind-merge` (helpers only)

## Local backend

Run Django in Docker with port 8000 published, then run `npm run dev` here.
Development requests to `/api/*` are proxied to `http://localhost:8000/api/*`.
To override the backend, copy `.env.example` to `.env.local` and set
`BACKEND_API_ORIGIN` to its origin (without `/api`), then restart Next.js.
`NEXT_PUBLIC_API_BASE_URL` remains supported as a fallback configuration.

The home page loads restaurants, resorts and gyms independently, displays API
pagination totals, and provides empty/error states with retry. It does not
substitute demo listings when the API is empty or unavailable. Hero photographs
come from those listings; the collection cards are editorial discovery links.

Development uses Webpack (`npm run dev`) because Turbopack stalled with repeated
worker creation on this local Node setup.

## Google sign-in

Set `NEXT_PUBLIC_GOOGLE_CLIENT_ID` in `.env.local` to your Google OAuth Web client
ID and restart Next.js. Configure that same ID as `GOOGLE_OAUTH_CLIENT_ID` in
Django, and authorize `http://localhost:3000` in the Google client's JavaScript
origins. The Google button appears on both join modes and exchanges Google's ID
token for a BizFindly session through `/api/auth/google/`.

## Conversational AI page

`/ai` streams replies from `/api/ai-query/chat/`, sending the last 12 completed
messages and current restaurant context. Search results update alongside the
conversation, and follow-ups can refine searches or ask about a selected place.
Stop cancels the browser request; clear resets the conversation. History stays in
memory and resets on reload. The API proxy forwards response streams without
buffering. No WebSocket server or extra client library is required.

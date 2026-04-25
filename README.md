# VoxScribe — AI Audio Transcription App

A full-stack Next.js application that transcribes audio files using Google's Gemini AI and stores the transcripts in a PostgreSQL database.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-blue?logo=postgresql)
![Better Auth](https://img.shields.io/badge/Auth-Better_Auth-purple)
![Gemini](https://img.shields.io/badge/AI-Gemini_2.5_Flash-orange?logo=google)

## Live Demo

- **URL**: [Deployed on Railway]
- **Admin Email**: `admin@test.com`
- **Admin Password**: `admin@123`

## Features

- **Authentication** — Secure login/logout with Better Auth (email & password)
- **Audio Upload** — Drag-and-drop or click-to-upload interface
- **AI Transcription** — Powered by Google Gemini 2.5 Flash
- **Transcript Management** — View, expand, copy, and delete transcripts
- **Dashboard Stats** — Total transcripts, word count, AI model info
- **Responsive Design** — Dark theme with glassmorphism UI, works on all screen sizes

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | JavaScript |
| Authentication | Better Auth |
| Database | PostgreSQL (via `pg` pool) |
| AI/Transcription | Google Gemini 2.5 Flash API |
| Styling | Vanilla CSS (dark theme) |
| Deployment | Railway |

## Core Flow

1. Admin logs in with email and password
2. Admin uploads a short audio file (< 1 min, max 20MB)
3. App sends audio to Gemini API for transcription
4. Only the transcript text is stored in PostgreSQL (not the audio file)
5. Admin can view all past transcripts on the dashboard
6. Admin can copy transcript text or delete transcripts
7. Logout redirects to login page

## Supported Audio Formats

MP3, WAV, OGG, AAC, M4A, WebM, FLAC

## Project Structure

```
src/
├── app/
│   ├── layout.jsx              # Root layout
│   ├── page.jsx                # Login page
│   ├── globals.css             # Design system
│   ├── api/
│   │   ├── auth/[...all]/      # Better Auth handler
│   │   ├── transcribe/         # Audio upload + Gemini transcription
│   │   └── transcripts/        # GET/DELETE transcripts
│   └── dashboard/
│       ├── layout.jsx          # Auth guard
│       └── page.jsx            # Dashboard (upload + transcript list)
├── components/
│   ├── Navbar.jsx              # Navigation bar with logout
│   ├── DashboardClient.jsx     # Client-side dashboard logic
│   ├── AudioUploader.jsx       # Drag-and-drop uploader
│   └── TranscriptCard.jsx      # Transcript display card
└── lib/
    ├── auth.js                 # Better Auth server config
    ├── auth-client.js          # Better Auth React client
    └── db.js                   # PostgreSQL connection pool
```

## Local Setup

### Prerequisites

- Node.js 18+
- PostgreSQL 15+

### Steps

```bash
# 1. Clone the repo
git clone <repo-url>
cd burzt

# 2. Install dependencies
npm install

# 3. Create a PostgreSQL database
# Using pgAdmin or psql:
CREATE DATABASE burzt;

# 4. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your values

# 5. Run database migrations (Better Auth tables)
npx @better-auth/cli migrate

# 6. Seed admin account + transcript table
npx tsx seed.js

# 7. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and login with `admin@test.com` / `admin@123`.

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | Auth encryption secret (32+ chars) |
| `BETTER_AUTH_URL` | App base URL |
| `GEMINI_API_KEY` | Google AI Studio API key |

## Deployment (Railway)

1. Create a Railway account (free trial)
2. Add a PostgreSQL service
3. Add a Next.js service (connect GitHub repo)
4. Set environment variables in Railway dashboard
5. Run `npx @better-auth/cli migrate` and `npx tsx seed.js` via Railway CLI or shell
6. App is live!

---

Built with ❤️ using Next.js, Better Auth, PostgreSQL, and Gemini AI.

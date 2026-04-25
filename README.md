<div align="center">
  <h1>🎙️ VoxScribe</h1>
  <p>An AI-powered audio transcription platform built with <strong>Next.js</strong>, <strong>Better Auth</strong>, and <strong>Google Gemini API</strong>.</p>

  <div>
    <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js&style=for-the-badge" alt="Next.js" />
    <img src="https://img.shields.io/badge/Better_Auth-Security-8B5CF6?style=for-the-badge" alt="Better Auth" />
    <img src="https://img.shields.io/badge/PostgreSQL-Data-316192?logo=postgresql&style=for-the-badge" alt="PostgreSQL" />
    <img src="https://img.shields.io/badge/Gemini_2.5-AI-F59E0B?logo=google&style=for-the-badge" alt="Google Gemini" />
    <img src="https://img.shields.io/badge/Railway-Deploy-0B0D0E?logo=railway&style=for-the-badge" alt="Railway" />
  </div>
</div>

<br />

## 🌟 Overview

**VoxScribe** is a full-stack web application designed to automatically transcribe short audio files using advanced AI. It provides a sleek, dark-themed, and secure dashboard where authorized administrators can upload audio and store transcripts directly in a PostgreSQL database. The application does not store the heavy audio files, ensuring an optimized and fast database.

---

## 🚀 Live Demo & Access

- **Public URL**: [https://burzt-burzt.up.railway.app](https://burzt-burzt.up.railway.app)
- **Admin Email**: `admin@test.com`
- **Admin Password**: `admin@123`

---

## ✨ Features

- **End-to-End Authentication**: Highly secure login and session management powered by Better Auth.
- **AI Transcription Engine**: Fast and accurate audio-to-text generation via Google's Gemini 2.5 Flash API.
- **Drag-and-Drop Uploader**: Seamless UX for uploading various audio formats (MP3, WAV, OGG, M4A, etc., max 20MB).
- **Persistent Storage**: Transcripts are permanently stored in a PostgreSQL database while strictly discarding the heavy audio payloads.
- **Glassmorphism UI**: A visually striking, responsive dark-mode interface built with Vanilla CSS variables and utility classes.
- **Transcript Management**: Expandable cards, one-click text copying, and deletion controls.

---

## 🛠️ Technology Stack

| Category | Technology Used |
| :--- | :--- |
| **Framework** | Next.js 16 (App Router) |
| **Authentication** | Better Auth (Email & Password) |
| **Database** | PostgreSQL |
| **Database Driver** | Raw `pg` Pool Connection |
| **AI Integration** | `@google/generative-ai` (Gemini 2.5 Flash) |
| **Styling** | Vanilla CSS (Dark Theme + Glassmorphism) |
| **Deployment** | Railway (Containerized Next.js & Postgres) |

---

## 📂 Project Structure

```text
burzt/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/[...all]/route.js   # Better Auth handler
│   │   │   ├── transcribe/route.js      # Gemini API execution
│   │   │   └── transcripts/route.js     # DB Operations (GET/DELETE)
│   │   ├── dashboard/                   # Protected admin dashboard
│   │   ├── layout.jsx                   # Root layout
│   │   └── page.jsx                     # Login root page
│   ├── components/
│   │   ├── AudioUploader.jsx            # Drag & drop component
│   │   ├── DashboardClient.jsx          # Client entry for dashboard
│   │   └── TranscriptCard.jsx           # Individual transcript UI
│   └── lib/
│       ├── auth.js                      # Server-side auth config
│       ├── auth-client.js               # Client-side auth config
│       └── db.js                        # Database connection pool
├── seed.js                              # Initial database + admin setup
└── .env.example                         # Environment variable structure
```

---

## 💻 Local Development Setup

If you wish to run this project locally, follow these steps:

### 1. Prerequisites
- **Node.js** (v18+)
- **PostgreSQL** instance running locally

### 2. Clone and Install
```bash
git clone <your-github-repo-link>
cd burzt
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory and populate it based on `.env.example`:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/burzt
BETTER_AUTH_SECRET=your_secret_string_here
BETTER_AUTH_URL=http://localhost:3000
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Database Setup & Seeding
This project uses a dedicated seeding script to migrate auth tables, create the `transcript` table, and automatically provision the admin account.
```bash
# 1. Migrate auth tables
npx @better-auth/cli migrate

# 2. Seed tables and admin user
npx tsx seed.js
```

### 5. Start Development Server
```bash
npm run dev
```
Open `http://localhost:3000` to access the application.

---


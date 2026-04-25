# Sonic Curator - Audio Transcription Admin

A full-stack Next.js application for audio transcription using Google Gemini AI.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Database:** PostgreSQL
- **Authentication:** Better Auth
- **AI:** Google Gemini (Free Tier)
- **Styling:** Custom CSS with Glassmorphism theme

## Features

- Secure admin authentication (username/password)
- Upload audio files (WAV, MP3, AAC up to 60 seconds)
- AI-powered transcription via Gemini API
- View transcript history
- Logout functionality

## Environment Variables

Create a `.env` file with:

```env
DATABASE_URL=postgresql://user:password@host:port/database
GEMINI_API_KEY=your_gemini_api_key
BETTER_AUTH_SECRET=your_secret_key
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

## Deployment

Deploy to Railway:

1. Connect your GitHub repository
2. Add environment variables in Railway dashboard
3. Deploy

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── auth/[...better-auth]/  # Auth endpoints
│   │   ├── transcripts/            # GET all transcripts
│   │   └── transcribe/             # POST - transcribe audio
│   ├── dashboard/
│   │   └── page.tsx                # Dashboard UI
│   ├── page.tsx                    # Login page
│   └── layout.tsx
├── lib/
│   ├── auth.ts                     # Better Auth config
│   ├── auth-client.ts              # Client auth
│   └── gemini.ts                   # Gemini transcription
├── db/
│   └── schema.ts                   # Database schema
└── .env                            # Environment (not committed)
```

## API Endpoints

- `POST /api/transcribe` - Upload audio and get transcription
- `GET /api/transcripts` - Get all transcripts for logged-in user


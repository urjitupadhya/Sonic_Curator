# 🎧 Sonic Curator

Sonic Curator is a premium, AI-powered audio transcription and management platform. Designed for "Operatives," it provides a secure and elegant environment to transcribe audio files using Google's Gemini 2.0 Flash AI and manage them through a centralized dashboard.

## 🚀 Live Demo
- **Vercel Deployment**: [https://sonic-curator-six.vercel.app/](https://sonic-curator-six.vercel.app/)
- **Video Walkthrough**: [https://youtu.be/9iXBcQbpf9M](https://youtu.be/9iXBcQbpf9M)

## ✨ Key Features
- **AI-Powered Transcription**: High-accuracy audio-to-text conversion using Gemini 2.0 Flash with a robust fallback strategy (1.5 Flash).
- **Secure Authentication**: Enterprise-grade auth system using **Better Auth** with PostgreSQL.
- **Operative Dashboard**: A sleek, dark-themed interface for managing transcript history, downloading content, and quick-copying text.
- **Mobile Responsive**: Fully optimized for desktop and mobile use.
- **Glassmorphic UI**: Modern design aesthetic with smooth transitions and interactive elements.

## 🛠️ Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Authentication**: Better Auth
- **Database**: PostgreSQL (Railway) with Drizzle ORM
- **AI Engine**: Google Generative AI (Gemini SDK)
- **Styling**: Tailwind CSS & Lucide React Icons
- **Deployment**: Vercel (Frontend/API) & Railway (Database)

## 📦 Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/urjitupadhya/Sonic_Curator.git
   cd Sonic_Curator
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="your_postgresql_url"
   GEMINI_API_KEY="your_google_ai_studio_key"
   BETTER_AUTH_SECRET="your_random_secret"
   BETTER_AUTH_URL="http://localhost:3000"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

4. **Initialize Database**:
   ```bash
   node migrate.mjs
   ```

5. **Run the development server**:
   ```bash
   npm run dev
   ```

## 📜 License
This project is for internal use and demonstration purposes.

---
*Developed by Urjit Upadhyay*

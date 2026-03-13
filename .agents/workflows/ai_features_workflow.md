---
description: How to setup and run the AI Resume Maker's new AI features
---
# AI Resume Maker - Features Workflow

This workflow documents the new features added to the AI Resume Maker application and provides steps to get them running locally.

## Features Added

1. **Google Authentication**
   - Implemented via Supabase OAuth.
   - Requires setting up Google Provider in the Supabase Dashboard.

2. **Notes Saver App**
   - A dedicated module (`/notes`) to jot down ideas, interview prep, and resources.
   - Synchronized with Supabase DB securely via Row Level Security (RLS).

3. **AI YouTube Summarizer**
   - Extracts YouTube video transcripts and summarizes them instantly.
   - Handled via the `/api/youtube` endpoint.

4. **AI Job Search (powered by Firecrawl)**
   - Scrapes web search results matching a given role and location.
   - Extracts and structures the postings into an easy-to-read job board using LLMs.
   - Handled via the `/api/job-search` endpoint.

## Step-by-Step Configuration

If you're deploying or running this locally, you must follow these steps to make sure the environment is fully equipped to handle the AI APIs and Supabase updates.

### 1. Database Setup
Run the updated SQL Schema inside your **Supabase Dashboard -> SQL Editor**. This creates the required `notes`, `youtube_summaries`, and `jobs_search_history` tables along with their RLS policies.

### 2. Configure Environment Variables
In your project directory, copy or edit your `.env.local` to include the following missing keys:

```env
# Existing
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Firecrawl API (required for AI Job Search)
# Grab a free key from https://firecrawl.dev
FIRECRAWL_API_KEY=your_firecrawl_api_key

# LLM API (Groq or OpenRouter) - Required for Job Parsing & YouTube Summarizing
# Provide either or both. The app prioritizes Groq for speed but falls back to OpenRouter.
GROQ_API_KEY=your_groq_api_key
OPENROUTER_API_KEY=your_openrouter_api_key
```

### 3. Setup Google OAuth in Supabase
- Go to your Supabase Project Dashboard.
- Navigate to **Authentication > Providers**.
- Enable **Google** and provide your Google Cloud OAuth Client ID and Secret.
- Ensure the Redirect URI configured in Google Cloud matches `https://your-project.supabase.co/auth/v1/callback`.

### 4. Running the App

// turbo
```bash
npm install
```

// turbo
```bash
npm run dev
```

1. Open `http://localhost:3000`.
2. Click **Sign In -> Continue with Google** (or create an account with Email/Password).
3. Once logged in, navigate safely through the new Dashboard Sidebar!

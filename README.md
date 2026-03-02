# AI Recipe Builder

A sleek, minimal, Apple-like web application that acts as your personal AI sous-chef. Generate custom recipes from your pantry, respect dietary constraints, and chat with the AI continuously while cooking.

Built with **Next.js (App Router), Tailwind CSS, shadcn/ui, Supabase, and Google Gemini SDK.**

## Features
- **Guest Mode:** Start immediately using local storage for your pantry and preferences.
- **Auth Mode:** Sync your saved data and generated recipe history across devices using Supabase Magic Links & Google OAuth.
- **Smart Preferences:** Set diets, allergies, budget, cook time, and skill level. The AI strictly adheres to these.
- **Pantry Builder:** Select what you have available, and the AI will prioritize using those ingredients.
- **Continuous AI Chat:** Every generated recipe has a persistent side-drawer chat for step-by-step guidance, substitutions, or "help I messed up" advice.
- **Apple-like Design:** Clean typography, generous whitespace, smooth edge radii, and dark mode support.

## Local Setup

### 1. Requirements
- Node.js >= 18
- npm or pnpm
- A Supabase Project
- A Google AI (Gemini) API Key

### 2. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Environment Variables
Copy the example env file:
\`\`\`bash
cp .env.example .env.local
\`\`\`

Fill in your \`.env.local\`:
\`\`\`
NEXT_PUBLIC_SUPABASE_URL=https://[YOUR-PROJECT].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
GOOGLE_GENERATIVE_AI_API_KEY=your-gemini-free-api-key
\`\`\`

### 4. Database Setup
1. Go to your Supabase project's SQL Editor.
2. Open the \`supabase_schema.sql\` file provided in the root of this repository.
3. Paste the contents into the Supabase SQL editor and execute it. This creates all tables and Row Level Security policies.

### 5. Run the App
\`\`\`bash
npm run dev
\`\`\`
Visit \`http://localhost:3000\`

## Deployment to Vercel

The easiest way to deploy this app is on Vercel:

1. Push this project to a new GitHub repository.
2. Go to [Vercel](https://vercel.com/new) and import the repository.
3. In the environment variables section, add the same 3 variables from your \`.env.local\`.
4. Click **Deploy**.

Make sure you update your Supabase Auth settings to include your new Vercel production URL in the `Site URL` and `Redirect URLs` settings!

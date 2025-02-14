# Pathlet Authentication Setup

## Prerequisites
- Node.js (v16 or later)
- npm or yarn

## Setup Instructions

1. Clone the repository
2. Install dependencies
```bash
npm install
```

3. Set up environment variables
- Copy `.env.local.example` to `.env.local`
- Fill in the required environment variables

## Environment Variables
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `NEXTAUTH_SECRET`: A long, random string for NextAuth
- `NEXTAUTH_URL`: Your application's base URL

## Running the Application
```bash
npm run dev
```

## Authentication Features
- Email/Password Sign Up
- Email/Password Sign In
- Magic Link Login
- Social Login (Google)
- Protected Routes

## Troubleshooting
- Ensure all environment variables are correctly set
- Check Supabase configuration
- Verify redirect URLs in Supabase settings

## Deployment
- Recommended platforms: Vercel, Netlify
- Set environment variables in deployment platform settings

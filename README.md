# Pathlet Client Application

## Overview
Pathlet is a modern web application built with Next.js, Supabase, and React.

## Prerequisites
- Node.js 18.18.0
- npm 
- Supabase Account

## Environment Setup
1. Clone the repository
2. Copy `.env.example` to `.env.production`
3. Fill in the required environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXTAUTH_SECRET`

## Local Development
```bash
npm install
npm run dev
```

## Build for Production
```bash
npm run build
```

## Deployment
Deployed on Netlify with the following configuration:
- Build Command: `npm run build`
- Publish Directory: `.next`

## Key Technologies
- Next.js 14
- React
- Supabase
- TailwindCSS
- TypeScript

## Troubleshooting
- Ensure all environment variables are correctly set
- Check Netlify build logs for specific errors
- Verify Node.js version compatibility

## License
Proprietary - All Rights Reserved

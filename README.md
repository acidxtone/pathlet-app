# Pathlet: Personal Insights Platform

## Overview
Pathlet is a comprehensive personal insights application that integrates Astrology, Numerology, and Human Design to provide users with deep, personalized life guidance.

## Features
- 🔐 Secure Authentication
- 🌟 Personalized Readings
- 🔮 Multi-Dimensional Insights
- 💬 Interactive Chat Interface

## Tech Stack
- Next.js 14
- React
- Supabase
- Tailwind CSS
- TypeScript

## Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn

### Installation
1. Clone the repository
2. Install dependencies
```bash
npm install
```

3. Set up environment variables
- Copy `.env.local.example` to `.env.local`
- Fill in Supabase and authentication credentials

### Running the Application
```bash
npm run dev
```

## Deployment
Deployed on Vercel with automatic GitHub integrations

## Vercel Deployment

### Prerequisites
- Vercel Account
- GitHub Repository

### Deployment Steps
1. Connect your GitHub repository to Vercel
2. Set Environment Variables in Vercel Dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXTAUTH_SECRET`

### Automatic Deployments
- Vercel will automatically deploy on every push to the `main` branch
- Preview deployments are created for pull requests

### Troubleshooting
- Ensure all environment variables are correctly set
- Check build logs in Vercel dashboard
- Verify Supabase and authentication configurations

## Environment Variables
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXTAUTH_SECRET`

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License
[Your License Here]

## Contact
[Your Contact Information]

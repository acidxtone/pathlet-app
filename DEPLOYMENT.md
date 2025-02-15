# Pathlet Client Deployment Guide

## Deployment with Netlify

### Prerequisites
- GitHub repository with the Pathlet client code
- Netlify account
- Supabase project

### Deployment Steps
1. Connect your GitHub repository to Netlify
2. Configure build settings:
   - Build Command: `npm run build`
   - Publish Directory: `dist`

### Environment Variables
In Netlify Dashboard, add these environment variables:
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key

### Configuration Files
- `netlify.toml`: Handles build and routing configurations
- `.env.local`: Local environment configuration (not deployed)

## Troubleshooting
- Ensure Node.js version 18.18.0+
- Verify Supabase configuration
- Check build logs in Netlify dashboard

## Performance Optimization
- Enable continuous deployment
- Use Netlify's built-in CDN
- Optimize Vite build settings

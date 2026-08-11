# Production Deployment Guide

## Deploying to Vercel / Netlify
1. Push repository to GitHub.
2. Import project into Vercel.
3. Configure environment variables in Vercel project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `GEMINI_API_KEY`
4. Run `npm run build` to verify clean compilation.

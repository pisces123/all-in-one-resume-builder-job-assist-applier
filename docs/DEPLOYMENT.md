# Deployment

The MVP is designed to deploy immediately on Vercel. Missing Supabase or DeepSeek credentials keep the app in demo mode instead of blocking the public shell.

## Vercel

```bash
npm install
npm run build
npx vercel --prod --yes
```

Set these environment variables in Vercel when services are ready:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DEEPSEEK_API_KEY=
AI_PROVIDER=deepseek
```

## GitHub

The repo should be public at:

```text
https://github.com/pisces123/all-in-one-resume-builder-job-assist-applier
```

Connect that repo to the Vercel project so pushes to `main` trigger production deployments.

## Production Checks

- `/api/health` shows connected service status without leaking secrets.
- Missing env vars leave the app usable in demo mode.
- Extension options should point to the deployed app URL.
- Vercel production logs should not contain resume text, cover letters, API keys, or Supabase service-role values.

# All in One Resume Builder and Job Assist Applier

A free, open-source job-search workspace for building resumes, checking ATS readiness, saving jobs from Chrome, tailoring applications, generating cover letters, exporting PDF/DOCX files, and tracking progress.

This first release ships as a live MVP shell. It works locally in demo mode right away and unlocks connected account storage plus AI drafting when Supabase and DeepSeek environment variables are configured.

Live app: https://all-in-one-resume-builder-job-assis.vercel.app

## Features

- Guided resume builder with text import
- ATS readiness estimate with keyword, structure, impact, and formatting checks
- Job database and tracker with `Saved`, `Tailored`, `Applied`, `Interviewing`, `Offer`, `Rejected`, and `Archived` stages
- Job-specific resume tailoring drafts
- Cover letter drafts
- PDF and DOCX export endpoint
- Chrome Manifest V3 right-click job saver
- Supabase schema with row-level security policies
- Server-side DeepSeek-compatible AI adapter with demo fallback

## Visual Assets

The landing-page workspace photo is from Pixabay: https://pixabay.com/photos/laptop-desk-setup-workspace-7093440/

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment

Copy `.env.example` to `.env.local` and fill values when you are ready to connect services.

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DEEPSEEK_API_KEY=
AI_PROVIDER=deepseek
```

No secrets should be committed. Production secrets belong in Vercel project settings.

## Chrome Extension

The unpacked Chrome extension lives in `extension/`.

1. Open `chrome://extensions`.
2. Enable Developer Mode.
3. Load unpacked and select the `extension/` folder.
4. Open extension options and confirm the app URL.

## Verification

```bash
npm run typecheck
npm run test
npm run build
```

## Deployment

Deploy on Vercel Hobby/free tier:

```bash
npx vercel --prod --yes
```

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

## License

MIT

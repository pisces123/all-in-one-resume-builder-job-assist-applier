# Contributing

Thanks for helping improve this free resume and job-search assistant.

## Local Setup

```bash
npm install
npm run dev
```

## Pull Request Checklist

- Keep resume and job data private by default.
- Do not log secrets, resumes, cover letters, or job descriptions unnecessarily.
- Run `npm run typecheck`, `npm run test`, and `npm run build`.
- Keep AI outputs truthful: never invent credentials, employers, schools, metrics, or contacts.
- Keep Chrome extension code bundled locally. Manifest V3 extensions must not load remote executable code.

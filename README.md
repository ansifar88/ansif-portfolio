# Muhammed Ansif Portfolio

Production-ready developer portfolio built with **Next.js (App Router)** and a **Node.js API route** for contact handling.

This project is designed to be recruiter-friendly, performance-conscious, and maintainable.

## Live Scope

- Sticky section-aware navigation
- Profile, experience timeline, projects, skills, trust signals, and contact sections
- Resume download endpoint (`/muhammed-ansif-resume.pdf`)
- Contact form with backend validation and anti-spam controls
- Optional transactional email delivery via Resend

## Tech Stack

- Framework: Next.js 15 (App Router)
- Language: TypeScript
- Runtime: Node.js
- Styling: Global CSS
- Contact delivery (optional): Resend API

## Architecture

- `app/page.tsx`: main single-page portfolio UI
- `app/globals.css`: global design system and section styles
- `app/layout.tsx`: metadata + fonts + app shell
- `app/api/contact/route.ts`: server-side contact API (validation, honeypot, rate limiting, optional email sending)
- `public/muhammed-ansif-resume.txt`: downloadable resume asset

## Contact API Behavior

`POST /api/contact`

### Request body

```json
{
  "name": "string",
  "email": "string",
  "message": "string",
  "company": "string"
}
```

### Validation

- `name`: required, 2-80 chars
- `email`: required, valid email format
- `message`: required, 10-2000 chars
- `company`: honeypot field (must be empty)

### Security controls

- Honeypot-based bot filtering
- IP-based in-memory rate limiting (`5 requests / 15 minutes`)
- Input normalization and strict server-side validation

### Delivery logic

- If `RESEND_API_KEY` + `CONTACT_TO_EMAIL` are configured: sends email via Resend
- If provider config is missing: accepts request and returns success capture response

## Environment Variables

Create `.env.local` in project root:

```bash
# Optional (enables actual email delivery)
RESEND_API_KEY=your_resend_api_key
CONTACT_TO_EMAIL=your_email@example.com
CONTACT_FROM_EMAIL="Portfolio <onboarding@resend.dev>"
```

If these are omitted, the contact API still works, but only acknowledges capture (no outbound email).

## Local Development

```bash
npm install
npm run dev
```

Open: `http://localhost:3000`

## Production Build

```bash
npm run build
npm run start
```

## Scripts

- `npm run dev` - start development server
- `npm run build` - create production build
- `npm run start` - serve production build
- `npm run lint` - run Next lint flow

## Deployment (Vercel Recommended)

1. Push repository to GitHub
2. Import project in Vercel
3. Add required env vars in Vercel Project Settings
4. Deploy

## Quality Checklist

Before pushing to production:

- `npx tsc --noEmit`
- Verify all project/repo links
- Verify contact form behavior (valid + invalid + rate-limit path)
- Verify resume download works
- Check mobile and desktop section spacing

## Project Structure

```text
.
├── app
│   ├── api
│   │   └── contact
│   │       └── route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── public
│   └── muhammed-ansif-resume.pdf
├── package.json
├── tsconfig.json
└── README.md
```

## Known Limitations

- Rate limiting is in-memory and resets on server restart (sufficient for portfolio scale, not distributed edge scale)
- External images may fail on restricted networks; fallback placeholders are implemented in UI

## License

Personal portfolio project for Muhammed Ansif A.

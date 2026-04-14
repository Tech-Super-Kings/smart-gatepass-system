# Smart GatePass

Smart GatePass is a hackathon-ready MVP foundation for a fast, secure, and contactless entry system used in apartments, malls, and IT parks.

## Tech Stack

- Next.js with App Router
- TypeScript
- Tailwind CSS
- MongoDB-ready structure with Mongoose
- Vercel-friendly project setup

## Current Setup

This first milestone includes:

- Project structure for `app`, `app/api`, `components`, `lib`, `models`, and `public`
- Base responsive layout and polished landing page
- Reusable UI components
- Global loading and error states
- MongoDB connection utility
- `Visitor` model schema
- Environment variable template

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env.local
```

3. Start the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

```env
MONGODB_URI=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

If `MONGODB_URI` is not set, the codebase is structured to support demo-friendly fallbacks in the next implementation steps.

## Planned Next Features

- Host visitor pass creation flow
- Visitor pass page with QR code
- Security verification workflow
- Admin dashboard with visitor logs
- Mock/demo fallback data and API routes

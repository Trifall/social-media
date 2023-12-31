# Social Media Site

## Overview

This is a mock social media site built by [Jerren Trifan](https://trifall.com) and [Dolan Reynolds](https://dolan.dev). It is similar in nature to a twitter style feed, with comments / likes / media features.

A working demo is accessible at [social.trifall.com](https://social.trifall.com/)

## Technologies Used

- Next.js 13 (Pages Router)
- React 18
- TailwindCSS
- HeadlessUI
- Turso (SQLite) Database
- Drizzle (ORM)
- Next-Auth
- UploadThing
- Zod
- React-Hook-Form

## Getting Started

1. Install Yarn

2. Install dependencies:

   ```bash
   yarn install
   ```

3. Make a copy of `.env.example` and rename it to `.env.local`
4. Fill in the environment variables in `.env.local` with your own values

## Development

First, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

(Database) Drizzle studio:

```bash
yarn studio
```

Open [http://localhost:3333](http://localhost:3333) with your browser to see the database studio.

Drizzle database migrations:

```bash
yarn generate
```

then

```bash
yarn migrate
```

Compile a production build:
```
yarn build
```

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

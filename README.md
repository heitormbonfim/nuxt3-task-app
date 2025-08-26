# Nuxt Tasks App

A simple app that demonstrates layouts, pages, data fetching and API routes in Nuxt.

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Install dependencies:

```bash
pnpm install
```

Create .env file:

```bash
cp .env.example .env
```

## Database

Run the migrations

```bash
pnpm drizzle-kit migrate
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
pnpm dev
```
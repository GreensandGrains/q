# Nexaro Cloud — Standalone

A self-contained version of the Nexaro Cloud website. No monorepo, no workspace — just `npm install` and go.

## Stack

- **Frontend**: React 19 + Vite + Tailwind CSS v4 (galaxy/purple/black theme)
- **Backend**: Express 5 + Drizzle ORM + PostgreSQL
- **Auth**: Email/password + Discord OAuth
- **UI**: Radix UI primitives + shadcn-style components

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment

```bash
cp .env.example .env
# Edit .env with your PostgreSQL connection string and a random SESSION_SECRET
```

### 3. Push the database schema

```bash
npm run db:push
```

### 4. Seed plans data

```bash
npm run db:seed
```

### 5. Run in development mode

```bash
npm run dev
# Frontend: http://localhost:3000
# API:      http://localhost:5000
```

## Production Build

```bash
npm run build
npm start
# Serves frontend + API at http://localhost:5000
```

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `SESSION_SECRET` | ✅ | Random secret for session tokens |
| `DISCORD_CLIENT_ID` | ❌ | Discord app client ID (for Discord OAuth) |
| `DISCORD_CLIENT_SECRET` | ❌ | Discord app client secret |
| `APP_URL` | ❌ | Your public URL (for Discord OAuth callback) |
| `PORT` | ❌ | Server port (default: 5000) |

## Discord OAuth Setup (optional)

1. Go to https://discord.com/developers/applications and create an app
2. Add redirect URI: `https://yourdomain.com/api/auth/discord/callback`
3. Copy Client ID and Client Secret to your `.env`
4. Set `APP_URL=https://yourdomain.com`

## API Routes

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | — | Create account |
| POST | `/api/auth/login` | — | Sign in |
| POST | `/api/auth/logout` | Bearer | Sign out |
| GET | `/api/auth/me` | Bearer | Current user |
| GET | `/api/auth/discord` | — | Discord OAuth start |
| GET | `/api/plans` | — | List all plans |
| GET | `/api/tickets` | Bearer | List your tickets |
| POST | `/api/tickets` | Bearer | Open a ticket |
| GET | `/api/stats/overview` | — | Site stats |

## Pages

| Route | Description |
|---|---|
| `/` | Home / hero |
| `/plans` | Pricing plans |
| `/login` | Sign in |
| `/register` | Create account |
| `/tickets` | Support tickets |
| `/privacy` | Privacy Policy |
| `/terms` | Terms of Service |
| `/security` | Security Policy |
| `/cookies` | Cookie Policy |
| `/dmca` | DMCA Policy |
| `/sla` | Service Level Agreement |

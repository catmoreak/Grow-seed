# Admin Panel - Full Stack

This is a **full-stack admin dashboard** for the Grow Seed platform. It includes both a modern React frontend (admin dashboard UI) and an Express backend that can call main website APIs.

## Features

- **React Admin Dashboard** - Modern UI for admin operations
- **Express.js Backend** - REST API server with TypeScript
- **CORS & Proxy** - Call main client website APIs securely
- **Full-Stack Integration** - Frontend and backend in one workspace

## Quick Start

### Installation

From the **server folder**:

```bash
npm install
```

This installs both admin dashboard and backend dependencies.

### Development

Run both admin dashboard and backend concurrently:

```bash
npm run dev
```

- **Admin Dashboard**: http://localhost:5173 (Vite dev server with HMR)
- **Backend API**: http://localhost:3000
- The dashboard proxies `/api/*` calls to the backend

### Individual Runs

```bash
npm run admin:dev       # Just admin dashboard UI
npm run backend:dev     # Just Express backend
```

### Build

```bash
npm run build
npm run start           # Run compiled production build
```

## Environment Variables

Copy `.env.example` to `.env`:

```env
PORT=3000
NODE_ENV=development
CLIENT_API_URL=http://localhost:5173
```

## Project Structure

```
server/
├── admin/                    # React admin dashboard frontend
│   ├── src/
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   ├── App.css
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── package.json
│   └── public/
│
├── src/                      # Express backend
│   └── index.ts
│
├── dist/                     # Built backend + admin frontend
│   └── admin/               # Production-built admin dashboard
│
├── tsconfig.json
├── package.json
├── .env.example
└── README.md
```

## API Endpoints

### Health Check
- **GET** `/api/health` - Backend server health status

### Admin Routes
- **GET** `/api/admin/client-data` - Example admin endpoint
- **POST** `/api/admin/proxy` - Proxy requests to main client website

### Admin Dashboard
- **GET** `/` - Serves admin dashboard (index.html)

## How It Works

### Development Flow:
1. **Admin Frontend** (React/Vite) runs on `http://localhost:5173`
2. Vite **proxy config** forwards `/api/*` to `http://localhost:3000`
3. **Backend** (Express) runs on `http://localhost:3000`
4. Backend handles API calls and can proxy to main website

### Production Flow:
1. Admin dashboard is **built** to `dist/admin/`
2. Express backend **serves** the admin dashboard as static files
3. All API calls come through Express on port 3000
4. Single deployment point

## Example: Admin Dashboard API Call

```typescript
// In React component
const response = await fetch('/api/admin/client-data');
const data = await response.json();

// Automatically proxied to http://localhost:3000/api/admin/client-data
```

## Example: Proxy to Main Website

```typescript
// Call main website API through admin server
const response = await fetch('/api/admin/proxy', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    endpoint: '/api/data',        // Main website endpoint
    method: 'GET'
  })
});
```

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Run admin + backend concurrently |
| `npm run admin:dev` | Run just admin dashboard |
| `npm run backend:dev` | Run just Express backend |
| `npm run build` | Build both admin + backend |
| `npm run start` | Run production build |
| `npm run lint` | Lint backend code |

## Architecture

```
┌─────────────────────┐
│  Admin Dashboard    │
│  React (Vite)       │
│  Port: 5173         │
└──────────┬──────────┘
           │ /api/* (proxied)
           ↓
┌─────────────────────┐
│  Express Backend    │
│  TypeScript         │
│  Port: 3000         │
└──────────┬──────────┘
           │ axios calls
           ↓
┌─────────────────────┐
│  Main Website API   │
│  (Client folder)    │
│  Port: 5173 (main)  │
└─────────────────────┘
```

## Next Steps

1. **Admin Routes** - Create custom admin API endpoints in `src/`
2. **Database** - Add MongoDB/PostgreSQL integration
3. **Auth** - Implement JWT or session authentication
4. **Validation** - Add input validation with `zod` or `joi`
5. **Admin UI** - Build admin-specific components in `admin/src/`

## Related

- **Client**: Main website (see `../client`)
- **Root**: Monorepo workspace configuration (see `../package.json`)


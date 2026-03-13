# Grow Seed - Main Website + Admin Panel

## Architecture

**3 Services Running:**

```
Users              Admins
  ↓                 ↓
5173              3001
(Client)       (Admin Dashboard)
  │                 │
  └─────────────────┘
        ↓ API calls
      3000
   (Backend API)
   - Handles user data
   - Processes admin requests
```

## Run the Application

### From Root (`Grow-seed/`)

**Start everything:**
```bash
npm run dev
```

This starts:
- **Client** (Main Website): http://localhost:5173
- **Admin Dashboard**: http://localhost:3001  
- **Backend API**: http://localhost:3000

### Individual Commands

**Just the main client:**
```bash
npm run client:dev
```
→ http://localhost:5173

**Just the server (backend + admin):**
```bash
npm run server:dev
```
→ Backend: http://localhost:3000
→ Admin: http://localhost:3001

## Project Structure

```
Grow-seed/
├── client/                    # Main Website (Users)
│   ├── src/
│   ├── package.json
│   ├── vite.config.ts        (proxy /api → 3000)
│   └── README.md
│
├── server/                    # Backend + Admin Panel
│   ├── src/
│   │   └── index.ts          (Express API on port 3000)
│   │
│   ├── admin/                # Admin Dashboard Vite App
│   │   ├── src/
│   │   ├── vite.config.ts    (port: 3001)
│   │   └── package.json
│   │
│   ├── package.json
│   └── README.md
│
├── package.json              # Root monorepo
└── README.md                 # This file
```

## How It Works

### User Journey (5173 → 3000)
1. User visits http://localhost:5173 (Client)
2. Client makes API calls: `fetch('/api/data')`
3. Vite proxy forwards to http://localhost:3000/api/data
4. Backend processes and returns data

### Admin Journey (3001 → 3000)
1. Admin visits http://localhost:3001 (Admin Dashboard)
2. Admin makes API calls: `fetch('/api/admin/...')`
3. Vite proxy forwards to http://localhost:3000/api/admin/...
4. Backend processes admin requests

## API Endpoints

All on **port 3000**:

```
GET    /health                    - Server health check
GET    /api/admin/client-data     - Admin data endpoint
POST   /api/admin/proxy           - Proxy to external APIs
```

## Build for Production

```bash
npm run build
```

Then run server:
```bash
npm run server:start
```

This serves:
- Built client on a separate deployment
- Admin dashboard as static files on :3000/admin
- Backend API on :3000/api

## Ports Summary

| Port | Service | Purpose | Access |
|------|---------|---------|--------|
| 5173 | Client (Vite) | Main website | Users |
| 3001 | Admin (Vite) | Admin dashboard | Admins |
| 3000 | Backend | API & static files | Both |

---

**Status**: ✅ Ready to run!

import type { Express, Request, Response, NextFunction } from 'express';
import express from 'express';
import path from 'path';
import fs from 'fs';

/**
 * Mount static file serving for the built client.
 * In development the Vite dev-server handles this, so the clientDist
 * folder won't exist — we skip silently in that case.
 */
export function setupStatic(app: Express, clientDist: string): void {
  if (!fs.existsSync(clientDist)) {
    console.warn(`[static] Client dist not found at "${clientDist}" — skipping static serving.`);
    return;
  }

  // Serve static assets (JS, CSS, images, etc.)
  app.use(express.static(clientDist));

  // SPA fallback: send index.html for any non-API route
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(clientDist, 'index.html'));
  });

  console.log(`[static] Serving client from "${clientDist}"`);
}

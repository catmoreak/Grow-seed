import { Router, Request, Response } from 'express';

const router = Router();

// Server status endpoint
router.get('/', (_req: Request, res: Response) => {
  res.json({
    status: 'Backend server is running 🚀',
    message: 'Grow-seed API is online',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    nodeVersion: process.version,
  });
});

router.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

router.get('/hello', (_req: Request, res: Response) => {
  res.json({ message: 'Hello from Grow-seed API!' });
});

export default router;

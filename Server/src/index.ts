import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { setupStatic } from './static';
import router from './routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middleware ---
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- API Routes ---
app.use('/api', router);

// --- Serve static client build (production) ---
setupStatic(app, path.resolve(__dirname, '../../client/dist'));

// --- Fallback route for root (dev mode) ---
app.get('/', (_req, res) => {
  res.status(200).json({
    message: '✅ Backend server is running',
    endpoints: {
      health: '/api/health',
      hello: '/api/hello',
    },
    dev_note: 'In development, the client runs on http://localhost:5173 via Vite.',
  });
});

// --- Start server ---
app.listen(PORT, () => {
  console.log(`  URL:         http://localhost:${PORT}`);
  console.log(`  Status:      GET /api`);
  console.log(`  Health:      GET /api/health`);
  console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('');
});

export default app;

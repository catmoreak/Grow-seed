import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app: Express = express();
const PORT = process.env.PORT || 3000;
const CLIENT_API_URL = process.env.CLIENT_API_URL || 'http://localhost:5173';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve admin dashboard static files (production build)
const adminDistPath = path.join(__dirname, '../dist/admin');
app.use(express.static(adminDistPath));

// API Routes
// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({ 
    status: 'Server is running', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Example: Admin route to fetch data from main client API
app.get('/api/admin/client-data', async (_req: Request, res: Response) => {
  try {
    // This is an example - replace with actual client API calls
    res.status(200).json({
      message: 'Admin can fetch main client data from here',
      clientApiUrl: CLIENT_API_URL,
      example: 'Use axios to call your main website APIs',
    });
  } catch (error) {
    console.error('Error fetching client data:', error);
    res.status(500).json({ error: 'Failed to fetch client data' });
  }
});

// Example: Proxy endpoint for calling main client API
app.post('/api/admin/proxy', async (req: Request, res: Response) => {
  try {
    const { endpoint, method = 'GET', data } = req.body;

    if (!endpoint) {
      res.status(400).json({ error: 'endpoint is required' });
      return;
    }

    const config: any = {
      method,
      url: `${CLIENT_API_URL}${endpoint}`,
    };

    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      config.data = data;
    }

    const response = await axios(config);
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Proxy request failed' });
  }
});

// Serve admin dashboard as fallback for SPA routing (production only)
// In development, admin runs separately on port 3001
app.get('*', (_req: Request, res: Response): void => {
  const indexPath = path.join(adminDistPath, 'index.html');
  
  // Only serve admin files if they exist (production build)
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(404).json({ 
        error: 'Not Found',
        message: 'API endpoints available at /api/*',
        dev_info: 'Admin dashboard runs on http://localhost:3001 in development'
      });
    }
  });
});

// Error handler
app.use((err: any, _req: Request, res: Response) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start server
app.listen(PORT, () => {
  const isDev = process.env.NODE_ENV !== 'production';
  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Server Started');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  if (isDev) {
    console.log('[DEVELOPMENT MODE]');
    console.log('Admin Dashboard:  http://localhost:3001 (Vite Dev Server)');
    console.log('Backend API:      http://localhost:3000');
    console.log('Main Website:     http://localhost:5173');
  } else {
    console.log('[PRODUCTION MODE]');
    console.log('Admin Dashboard:  http://localhost:3000 (served by Express)');
    console.log('Backend API:      http://localhost:3000/api');
    console.log(`Main Website:     ${CLIENT_API_URL}`);
  }
  
  console.log(`Environment:      ${process.env.NODE_ENV || 'development'}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
});

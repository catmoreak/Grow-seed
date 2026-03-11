/**
 * Basic connectivity test — run with `npm test` (or `tsx src/test.ts`).
 * Starts the server, hits the health endpoint, then exits.
 */
import http from 'http';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;
const HOST = `http://localhost:${PORT}`;

function get(url: string): Promise<{ status: number; body: string }> {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => resolve({ status: res.statusCode ?? 0, body }));
    }).on('error', reject);
  });
}

async function runTests(): Promise<void> {
  console.log(`Running tests against ${HOST} …\n`);

  // Test 1 — health check
  const health = await get(`${HOST}/api/health`);
  console.assert(health.status === 200, `FAIL health: expected 200, got ${health.status}`);
  console.log(`[PASS] GET /api/health  →  ${health.status}  ${health.body.trim()}`);

  // Test 2 — hello endpoint
  const hello = await get(`${HOST}/api/hello`);
  console.assert(hello.status === 200, `FAIL hello: expected 200, got ${hello.status}`);
  console.log(`[PASS] GET /api/hello   →  ${hello.status}  ${hello.body.trim()}`);

  console.log('\nAll tests passed.');
}

runTests().catch((err) => {
  console.error('Test error:', err.message);
  console.error('Make sure the server is running (`npm run dev`) before running tests.');
  process.exit(1);
});

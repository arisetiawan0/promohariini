import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 8000;
const UPSTREAM = 'https://promo.beautykendari.id/api/tv/promos/discounts/today';
const TOKEN = process.env.PROMO_API_TOKEN || 'absgroup-kdi';

const server = http.createServer(async (req, res) => {
  // 1. API proxy route
  if (req.url === '/api/promos') {
    try {
      console.log(`[Proxy] Fetching from upstream: ${UPSTREAM}`);
      const upstreamRes = await fetch(UPSTREAM, {
        headers: { Authorization: `Bearer ${TOKEN}` },
      });
      const body = await upstreamRes.text();
      res.writeHead(upstreamRes.status, {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store',
      });
      res.end(body);
    } catch (err) {
      console.error('[Proxy Error]', err);
      res.writeHead(502, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        error: 'upstream_unreachable',
        message: 'Gagal menghubungi server promo lokal/hulu.',
      }));
    }
    return;
  }

  // 2. Serve index.html or other static files
  let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
  
  // Basic security check
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404);
        res.end('Not Found');
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      let contentType = 'text/html';
      if (filePath.endsWith('.js')) contentType = 'text/javascript';
      if (filePath.endsWith('.css')) contentType = 'text/css';
      if (filePath.endsWith('.json')) contentType = 'application/json';
      
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
  console.log(`🔗 Proxy API diarahkan ke: ${UPSTREAM}`);
  console.log(`==================================================\n`);
});

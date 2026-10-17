import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { botpressMiddleware } from './botpressMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

const PORT = process.env.PORT || 3001;

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer(async (req, res) => {
  // 1. Nếu là API Botpress
  if (req.url?.startsWith('/api/botpress')) {
    // Chuẩn hóa url cho middleware
    const originalUrl = req.url;
    req.url = originalUrl.replace(/^\/api\/botpress/, '');
    return botpressMiddleware(req, res, () => {
      res.statusCode = 404;
      res.end(JSON.stringify({ error: 'Endpoint not found' }));
    });
  }

  // 2. Phục vụ tĩnh thư mục dist nếu có
  let filePath = path.join(distDir, req.url === '/' ? 'index.html' : req.url);
  if (!fs.existsSync(filePath)) {
    filePath = path.join(distDir, 'index.html');
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'MewTinHoc Botpress Backend Server is Running',
      port: PORT,
      botpressEndpoints: ['/api/botpress/status', '/api/botpress/files', '/api/botpress/chat']
    }));
  }
});

server.listen(PORT, () => {
  console.log(`🚀 [Botpress Backend Server] Đang chạy tại http://localhost:${PORT}`);
  console.log(`🔒 Botpress Token & Bot ID được bảo mật an toàn tại Backend.`);
});

/**
 * Máy chủ tĩnh nhỏ để xem thử trang trên máy mình.
 *
 * Có sẵn trong dự án để `npm run dev` chạy được ngay, không cần tải gói nào về,
 * không cần mạng. Chỉ dùng lúc phát triển - khi đưa lên GitHub Pages hay Netlify
 * thì họ tự phục vụ file tĩnh, không cần tới file này.
 */

import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const PORT = Number(process.env.PORT) || 4321;

const CONTENT_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.mp3': 'audio/mpeg',
  '.md': 'text/markdown; charset=utf-8',
};

createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const relative = url.pathname === '/' ? 'index.html' : url.pathname.slice(1);
  const file = join(ROOT, normalize(relative));

  // Chặn việc đi ngược ra ngoài thư mục dự án
  if (!file.startsWith(ROOT)) {
    res.writeHead(403).end('Khong duoc phep');
    return;
  }

  try {
    const body = await readFile(file);
    res.writeHead(200, {
      'Content-Type': CONTENT_TYPES[extname(file)] ?? 'application/octet-stream',
      'Cache-Control': 'no-store',
    });
    res.end(body);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(`Khong tim thay: ${relative}`);
  }
}).listen(PORT, () => {
  console.log(`Trang dang chay tai: http://localhost:${PORT}`);
  console.log('Xem thu mot ngay khac:  http://localhost:' + PORT + '/?ngay=2027-02-04');
  console.log('Bam Ctrl+C de dung.');
});

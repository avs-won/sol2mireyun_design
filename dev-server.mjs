// 로컬 개발 서버 — 따로 설치할 것 없이 Node.js만 있으면 실행됩니다.
// 실행: npm run dev  →  http://localhost:5173
// 파일을 저장하면 브라우저가 자동으로 새로고침됩니다. (배포에는 영향 없음)

import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { watch } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT) || 5173;

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.txt': 'text/plain; charset=utf-8',
};

// 브라우저에 끼워 넣는 자동 새로고침 코드
const reloadSnippet =
  "<script>new EventSource('/__reload').onmessage=function(){location.reload()}</script>";

const clients = new Set();

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');

  if (url.pathname === '/__reload') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });
    res.write(': connected\n\n');
    clients.add(res);
    req.on('close', () => clients.delete(res));
    return;
  }

  // 문의 폼 등 서버 기능(/api/...)은 배포된 사이트에서만 동작합니다.
  if (url.pathname.startsWith('/api/')) {
    res.writeHead(501, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ ok: false, error: '로컬에서는 메일 발송이 동작하지 않습니다.' }));
    return;
  }

  let filePath = path.normalize(path.join(root, decodeURIComponent(url.pathname)));
  if (filePath !== root && !filePath.startsWith(root + path.sep)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  try {
    const info = await stat(filePath);
    if (info.isDirectory()) filePath = path.join(filePath, 'index.html');
    let body = await readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();
    if (ext === '.html') {
      body = Buffer.from(body.toString('utf8').replace('</body>', reloadSnippet + '</body>'));
    }
    res.writeHead(200, {
      'Content-Type': types[ext] || 'application/octet-stream',
      'Cache-Control': 'no-store',
    });
    res.end(body);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 — 파일을 찾을 수 없습니다: ' + url.pathname);
  }
});

let timer;
watch(root, { recursive: true }, (_event, file) => {
  if (!file || /node_modules|\.git[\\/]|\.vercel/.test(file)) return;
  clearTimeout(timer);
  timer = setTimeout(() => {
    for (const client of clients) client.write('data: reload\n\n');
  }, 80);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n  ${port}번 포트를 이미 다른 프로그램이 쓰고 있어요.`);
    console.error('  다른 번호로 실행하려면:  PORT=5174 npm run dev  (Windows PowerShell: $env:PORT=5174; npm run dev)\n');
  } else {
    console.error(err);
  }
  process.exit(1);
});

server.listen(port, () => {
  console.log(`\n  미래연 시안 → http://localhost:${port}`);
  console.log('  파일을 저장하면 브라우저가 자동으로 새로고침됩니다. 종료: Ctrl + C\n');
});

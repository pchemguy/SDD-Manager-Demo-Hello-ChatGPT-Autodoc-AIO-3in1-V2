/** Serve one explicit runtime directory on an owned loopback listener. */
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
export async function serve(directory) {
  const base = path.resolve(directory);
  const server = http.createServer(async (request, response) => {
    try {
      const url = new URL(request.url, 'http://localhost');
      const relative = decodeURIComponent(url.pathname).replace(/^\/+/, '') || 'index.html';
      const file = path.resolve(base, relative);
      if (!file.startsWith(base + path.sep)) { response.writeHead(403).end(); return; }
      const types = { '.html': 'text/html', '.xhtml': 'application/xhtml+xml', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json' };
      const data = await fs.readFile(file);
      response.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
      response.end(data);
    } catch { response.writeHead(404).end(); }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  return { url: `http://127.0.0.1:${server.address().port}`, close: () => new Promise(resolve => server.close(resolve)) };
}

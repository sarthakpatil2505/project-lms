const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const PUBLIC_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
};

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const urlPath = req.url.split('?')[0];

  // Direct download route for the PDF report
  if (urlPath === '/download-pdf' || urlPath === '/roadmap.pdf') {
    const pdfPath = path.join(PUBLIC_DIR, 'AETHERLMS_30_DAY_ROADMAP.pdf');
    fs.readFile(pdfPath, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 PDF Not Found');
        return;
      }
      res.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="AetherLMS_30_Day_Development_Roadmap.pdf"',
        'Content-Length': data.length,
      });
      res.end(data);
    });
    return;
  }

  // View PDF inline route
  if (urlPath === '/view-pdf') {
    const pdfPath = path.join(PUBLIC_DIR, 'AETHERLMS_30_DAY_ROADMAP.pdf');
    fs.readFile(pdfPath, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 PDF Not Found');
        return;
      }
      res.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="AetherLMS_30_Day_Development_Roadmap.pdf"',
        'Content-Length': data.length,
      });
      res.end(data);
    });
    return;
  }

  // HTML Web Report route
  if (urlPath === '/roadmap-report' || urlPath === '/report') {
    const htmlReportPath = path.join(PUBLIC_DIR, 'AETHERLMS_30_DAY_ROADMAP.html');
    fs.readFile(htmlReportPath, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Report Not Found');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
    return;
  }

  // Static file serving fallback to index.html
  let filePath = path.join(PUBLIC_DIR, urlPath === '/' ? 'index.html' : urlPath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      filePath = path.join(PUBLIC_DIR, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Server Error: ' + err.code);
        return;
      }
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    });
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`====================================================`);
  console.log(`  AetherLMS Server is live:`);
  console.log(`  👉 Main App:     http://localhost:${PORT}`);
  console.log(`  👉 Download PDF: http://localhost:${PORT}/download-pdf`);
  console.log(`  👉 View PDF:     http://localhost:${PORT}/view-pdf`);
  console.log(`  👉 HTML Report:  http://localhost:${PORT}/report`);
  console.log(`====================================================`);
});

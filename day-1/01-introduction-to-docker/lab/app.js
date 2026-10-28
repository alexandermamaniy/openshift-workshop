const express = require('express');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Docker Getting Started</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: system-ui, -apple-system, sans-serif;
      background: #f0f4f8;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 20px;
    }
    .card {
      background: white;
      border-radius: 12px;
      padding: 40px;
      max-width: 540px;
      width: 100%;
      box-shadow: 0 4px 24px rgba(0,0,0,0.08);
    }
    h1 { font-size: 2rem; margin-bottom: 8px; }
    .subtitle { color: #64748b; margin-bottom: 28px; }
    .badge {
      display: inline-block;
      background: #0db7ed;
      color: white;
      font-size: 0.75rem;
      font-weight: 600;
      padding: 3px 10px;
      border-radius: 20px;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      margin-bottom: 28px;
    }
    .info-grid {
      display: grid;
      gap: 12px;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 14px;
      background: #f8fafc;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
    }
    .info-label { font-size: 0.85rem; color: #64748b; font-weight: 500; }
    code {
      font-family: 'Menlo', 'Monaco', monospace;
      font-size: 0.85rem;
      color: #0369a1;
      background: #e0f2fe;
      padding: 2px 8px;
      border-radius: 4px;
    }
    .footer { margin-top: 24px; font-size: 0.8rem; color: #94a3b8; text-align: center; }
  </style>
</head>
<body>
  <div class="card">
    <h1>🐳 Hello from Docker!</h1>
    <p class="subtitle">This app is running inside a container.</p>
    <span class="badge">Containerized</span>
    <div class="info-grid">
      <div class="info-row">
        <span class="info-label">Container Hostname</span>
        <code>${os.hostname()}</code>
      </div>
      <div class="info-row">
        <span class="info-label">Platform</span>
        <code>${os.platform()}/${os.arch()}</code>
      </div>
      <div class="info-row">
        <span class="info-label">Node.js Version</span>
        <code>${process.version}</code>
      </div>
      <div class="info-row">
        <span class="info-label">Port</span>
        <code>${PORT}</code>
      </div>
    </div>
    <p class="footer">The "Container Hostname" above is the container's ID — unique to each running instance.</p>
  </div>
</body>
</html>`);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🐳 App listening on port ${PORT}`);
});

const http = require('http');
const httpProxy = require('http-proxy');

const proxy = httpProxy.createProxyServer({
  target: 'https://api.adsb.lol',
  changeOrigin: true,
  secure: true,
});

const server = http.createServer((req, res) => {
  // Strip the /api prefix before forwarding
  req.url = req.url.replace(/^\/api/, '');

  // Allow all origins for local dev
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  proxy.web(req, res);
});

proxy.on('error', (err, _req, res) => {
  console.error('Proxy error:', err.message);
  res.writeHead(502);
  res.end('Proxy error');
});

server.listen(3001, () => {
  console.log('CORS proxy listening on http://localhost:3001');
  console.log('Forwarding /api/* -> https://api.adsb.lol/*');
});

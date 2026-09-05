const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, 'public');
const types = {'.html':'text/html; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.woff2':'font/woff2'};
http.createServer((req,res)=>{
 if(req.url === '/healthz'){res.writeHead(200,{'Content-Type':'application/json'});return res.end('{"status":"ok"}');}
 if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);return res.end();}
 let pathname;try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname)}catch{res.writeHead(400);return res.end();}
 const file=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
 if(!file.startsWith(root+path.sep)){res.writeHead(403);return res.end();}
 fs.stat(file,(err,stat)=>{if(err||!stat.isFile()){res.writeHead(404);return res.end('Not found');}res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','X-Content-Type-Options':'nosniff'});if(req.method==='HEAD')return res.end();fs.createReadStream(file).pipe(res);});
}).listen(Number(process.env.PORT)||3000,'0.0.0.0');

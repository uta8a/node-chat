const WebSocketServer = require('websocket').server;
const http = require('http');
const fs = require('fs');
const url = require('url');

const server = http.createServer((req,res) => {
  const p = url.parse(req.url, true);
  let path = '.' + p.pathname;
  if (path === './') path = './index.html';
  fs.readFile(path,(err, data) => {
    if (err) {
      res.writeHead(404, {'Content-Type' : 'text/plain'});
      res.end('sorry, 404 Not Found.')
    } else if (path === './stylesheet.css') {
      res.writeHead(200, {'Content-Type' : 'text/css'});
      res.end(data);
    } else {
      res.writeHead(200, {'Content-Type' : 'text/html'});
      res.end(data);
    }
  });
}).listen(8080);


const wsServer = new WebSocketServer({
  httpServer : server
});
// onが受信
wsServer.on('request', req => {
  const connection = req.accept();
  connection.on('message', msg => {
    console.log(msg.utf8Data);
    wsServer.broadcast(msg.utf8Data);
  });
});

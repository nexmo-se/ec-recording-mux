require('dotenv').config()
const express = require('express')
const path = require('path');
const cors = require('cors')
const RoomListener = require("./listeners/room");

const app = express()
app.use(express.json());
app.use(cors())

const webSocketServerPort = process.env.NERU_APP_PORT || process.env.PORT || 8081;
const webSocketServer = require('websocket').server;
const http = require('http');

const firebaseAuthMiddleware = require('./auth/firebaseAuthMiddleware')
const muxWebhookAuthMiddleware = require('./auth/muxWebhookAuthMiddleware.js');

let clients = {};

const updateClients = function(req, res, next) {
  req.body.clients = clients;
  next();
}

const server = http.createServer(app);
const wsServer = new webSocketServer({
  httpServer: server
})

wsServer.on('request', function(request) {
  console.log(`${(new Date())} received a new connection from ${request.origin}`)

  const room = request.resourceURL.query.room
  // Acccept all request, can set to accept only specific origin
  if (!room) return;
  const connection = request.accept(null, request.origin)
  if(clients[room]) {
    clients[room].push(connection) 
  }
  else {
    clients[room] = [connection]
  }
})

app.get('/_/health', async (req, res) => {
  res.sendStatus(200);
});

app.post('/initialize', firebaseAuthMiddleware, RoomListener.initialize)

app.post('/startRecording', firebaseAuthMiddleware, RoomListener.startMuxBroadcast)

app.post('/stopRecording', firebaseAuthMiddleware, RoomListener.stopMuxBroadcast) 

app.post('/muxEvent', muxWebhookAuthMiddleware, updateClients, RoomListener.muxEvent)


// Vonage
app.post('/ecStartRecording', firebaseAuthMiddleware, RoomListener.startEcRecording)

app.post('/ecStopRecording', firebaseAuthMiddleware, RoomListener.stopEcRecording) 

app.get('/getVonageRecord/:archiveId', firebaseAuthMiddleware, RoomListener.getVonageRecord)


app.use((req, res, next) => {
  // Here we add Cache-Control headers in accordance with the create-react-app best practices.
  // See: https://create-react-app.dev/docs/production-build/#static-file-caching
  if (req.path === '/' || req.path === 'index.html') {
    res.set('Cache-Control', 'no-cache');
    res.sendFile(path.join(__dirname, '../build/index.html'), { etag: false, lastModified: false });
  } else {
    res.set('Cache-Control', 'max-age=31536000');
    next();
  }
});

app.use(express.static(path.join(__dirname, '../build')));

app.get('*', (_, res) => {
  // Don't cache index.html
  res.set('Cache-Control', 'no-cache');
  res.sendFile(path.join(__dirname, '../build/index.html'), { etag: false, lastModified: false });
});

server.listen(webSocketServerPort, () => {
    console.log('server started on port', webSocketServerPort);
});

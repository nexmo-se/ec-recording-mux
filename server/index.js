require('dotenv').config()
const express = require('express')
const path = require('path');
const cors = require('cors')
const RoomListener = require("./listeners/room");

const app = express()
app.use(express.json());
app.use(cors())

app.use(express.static(path.join(__dirname, 'build')));

const webSocketServerPort = process.env.PORT || 3002;
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

app.get('/', (req, res) => {
    res.sendFile('index.html');
})

app.post('/initialize', firebaseAuthMiddleware, RoomListener.initialize)

app.post('/startRecording', firebaseAuthMiddleware, RoomListener.startMuxBroadcast)

app.post('/stopRecording', firebaseAuthMiddleware, RoomListener.stopMuxBroadcast) 

app.post('/muxEvent', muxWebhookAuthMiddleware, updateClients, RoomListener.muxEvent)

server.listen(webSocketServerPort, () => {
    console.log('server started on port', webSocketServerPort);
});

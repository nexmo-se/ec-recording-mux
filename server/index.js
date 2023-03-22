require('dotenv').config()
const express = require('express')
const path = require('path');
const cors = require('cors')
const RoomListener = require("./listeners/room");

const app = express()
app.use(express.json());
app.use(cors())

app.use(express.static(path.join(__dirname, 'build')));

const PORT = process.env.PORT || 3002;

const noopMiddleware = (_, __, next) => next();
const firebaseAuthMiddleware =
  process.env.REACT_APP_SET_AUTH === 'firebase' ? require('./auth/firebaseAuthMiddleware') : noopMiddleware;
const muxWebhookAuthMiddleware = require('./auth/muxWebhookAuthMiddleware.js')

app.get('/', (req, res) => {
    res.sendFile('index.html');
})

// TODO: authenticate
app.post('/initialize', firebaseAuthMiddleware, RoomListener.initialize)

app.post('/startMuxBroadcast', firebaseAuthMiddleware, RoomListener.startMuxBroadcast)

app.post('/stopMuxBroadcast', firebaseAuthMiddleware, RoomListener.startMuxBroadcast) 

app.post('/muxEvent', muxWebhookAuthMiddleware, RoomListener.muxEvent)


app.listen(PORT, () =>  console.log(`Listening to port ${PORT}`))
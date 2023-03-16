require('dotenv').config()
const express = require('express')
const path = require('path');
const axios = require('axios');
const cors = require('cors')
const Mux = require('@mux/mux-node');

const app = express()
app.use(express.json());
app.use(cors())

app.use(express.static(path.join(__dirname, 'build')));

const PORT = process.env.PORT || 3002;
const { MUX_TOKEN_ID, MUX_TOKEN_SECRET } = process.env;
const { Video } = new Mux(MUX_TOKEN_ID, MUX_TOKEN_SECRET);
const auth = Buffer.from(`${MUX_TOKEN_ID}:${MUX_TOKEN_SECRET}`).toString("base64");

let spaces = {}
let broadcasts = {}


app.get('/', (req, res) => {
    res.sendFile('index.html');
})

// TODO: authenticate
app.post('/initialize', async (req,res) => {
    const roomName = req.body.roomName
    try {
        if (!spaces[roomName]) {
            const space = await createSpace()
            spaces[roomName] = space.id
        }
        console.log("space id", spaces[roomName])

        const spaceToken = Mux.JWT.signSpaceId(spaces[roomName])

        console.log("space token", spaceToken)

        if (!broadcasts[roomName]) {
            const broadcast = await createBroadcast(spaces[roomName])
            console.log("broadcast id", broadcast.id )

            broadcasts[roomName] = broadcast.id
        }

        res.json({spaceId: spaces[roomName], spaceToken, broadcastId: broadcasts[roomName]})
    }
    catch(e) {
        // console.log("initialize error", e)
        res.status(501).end()
    }
})


app.post('/startBroadcast', async (req,res) => {
    // Use broadcast to send live stream, mux will automatically records the live streams
    const {broadcastId, spaceId} = req.body

    if (!broadcastId || !spaceId) res.status(501).end()

    console.log("space id1", spaceId)
    console.log("broadcast id1", broadcastId)

    try {
        await axios.post(`https://api.mux.com/video/v1/spaces/${spaceId}/broadcasts/${broadcastId}/start`, {
        }, 
        {
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/json',
            }
        })
        res.status(201).end()
    }
    catch(e) {
        console.log("startBroadcast error", e)
        res.status(501).end()
    }
})

app.post('/stopBroadcast', async (req, res) => {
      // Use broadcast to record the streams
      const {broadcastId, spaceId} = req.body

      if (!broadcastId || !spaceId) res.status(501).end()
  
      try {
        await axios.post(`https://api.mux.com/video/v1/spaces/${spaceId}/broadcasts/${broadcastId}/stop`, {
          }, 
          {
              headers: {
                  'Authorization': `Basic ${auth}`,
                  'Content-Type': 'application/json',
              }
          })
          res.status(201).end()
      }
      catch(e) {
          console.log("startBroadcast error", e.response.data)
          res.status(501).end()
      }

})

app.post('/event', (req,res) => {
    console.log("req tyoe ", req.body.type)

    if (req.body.type === "video.asset.ready") {
        const assetId = req.body.object.id
        getAssetUrl(assetId)
    }
    if (req.body.type === "video.asset.master.ready") {
        console.log("event master ready", req.body.data.master.url)
    }

})

async function getAssetUrl(assetId) {
    try {
        const response = await axios.put(`https://api.mux.com/video/v1/assets/${assetId}/master-access`, {
            "master_access": "temporary"
        }, 
        {
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/json',
            }
        })
        console.log("response ", response.data)
        return response
    }
    catch(e) {
        console.log("getasset error ", e.response.data)
        return
    }
}

async function createSpace() {
    const response = await axios.post('https://api.mux.com/video/v1/spaces', {
            type: 'server'
        }, 
        {
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/json',
            }
        })

    return response.data.data
}

async function createBroadcast(spaceId) {

    try {
        const liveStream = await Video.LiveStreams.create({
            playback_policy: 'public',
            new_asset_settings: { 
                playback_policy: 'public'
            }
        });
        console.log("livestream", liveStream)
        console.log("livestream id ", liveStream.id)
        console.log("space id", spaceId)
        
        const response = await axios.post(`https://api.mux.com/video/v1/spaces/${spaceId}/broadcasts`, {
            live_stream_id: liveStream.id,
        }, 
        {
            headers: {
                'Authorization': `Basic ZmJiNmYyNjktNzRlMi00ODcxLWI0NTctOTc5NDJkMTI4MzI0OnpGdGk2WkxtRlFGWVVGMjVNNUxVUW9EUFZDdWRGS3d2aStEYnF4TFgvcFpnRDZVaHpxMUwrYUx4UERCZUl4VTFjMXZKOWpoRkVZdA==`,
                'Content-Type': 'application/json',
            }
        })
        return response.data.data
    }
    catch(e) {
        console.log("error here ", e.response.data)
        return
    }
   
}



  

app.listen(PORT, () =>  console.log(`Listening to port ${PORT}`))
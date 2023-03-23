const MuxAPI = require("../../api/mux")

let spaces = {}
let broadcasts = {}

class RoomListener{
    static async initialize(req, res) {
        const roomName = req.body.roomName
        try {
            if (!spaces[roomName]) {
                const space = await MuxAPI.createSpace()
                spaces[roomName] = space
            }    
            const spaceToken = await MuxAPI.generateMuxJwt(spaces[roomName].id)
        
            if (!broadcasts[roomName]) {
                const broadcast = await MuxAPI.createBroadcast(spaces[roomName].id)
    
                broadcasts[roomName] = broadcast
            }
            
            res.json({name: roomName, spaceId: spaces[roomName].id, spaceToken, broadcastId: broadcasts[roomName].id})
        }
        catch(e) {
            console.log("initialize error", e.response.data.error)
            res.status(501).end()
        }
    }

    static async startMuxBroadcast(req, res) {
            // Use broadcast to send live stream, mux will automatically records the live streams
            const {spaceId, broadcastId} = req.body
            console.log("Start Mux broadcast ", spaceId, ' ', broadcastId)
        
            if ( !spaceId || !broadcastId) res.status(501).end()
        
            try {
                const _ = await MuxAPI.startMuxBroadcast(spaceId, broadcastId)
                res.status(201).end()
            }
            catch(e) {
                console.log("start broadcast error ", e.response.data.error)
                res.status(501).end()
            }
    }

    static async stopMuxBroadcast(req, res) {
        // Use broadcast to record the streams
        const {broadcastId, spaceId} = req.body
        console.log("Stop Mux broadcast ", spaceId, ' ', broadcastId)

    
        if (!broadcastId || !spaceId) res.status(501).end()
    
        try {
            const _ = await MuxAPI.stopMuxBroadcast(spaceId, broadcastId)
            res.status(201).end()
        }
        catch(e) {
            console.log("stop broadcast error error", e.response.data)
            res.status(501).end()
        }
    }

    static async muxEvent(req, res) {
        try {
            if (req.body.type === "video.asset.ready") {
                console.log("video asset ready")
                const assetId = req.body.object.id
                await MuxAPI.getAssetUrl(assetId)
            }
            if (req.body.type === "video.asset.master.ready") {
                console.log("video master ready")

                // Find corresponsing broadcast
                let targetRoomName = '';
                for (const key in broadcasts) {
                    if (broadcasts[key].live_stream_id === req.body.data.live_stream_id) {
                        targetRoomName = key
                        break;
                    }
                }

                if (req.body.clients[targetRoomName]) {
                    req.body.clients[targetRoomName].forEach((client) => {
                        client.send(JSON.stringify({recordedUrl: req.body.data.master.url}))
                    })
                }
            }
            res.status(200).end()
        }
        catch(e) {
            res.status(501).end()
        }
    }
}

module.exports = RoomListener;

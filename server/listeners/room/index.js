const MuxAPI = require("../../api/mux")

let spaces = {}
let broadcasts = {}

class RoomListener{
    static async initialize(req, res) {
        const roomName = req.body.roomName
        try {
            if (!spaces[roomName]) {
                const space = await MuxAPI.createSpace()
                spaces[roomName] = space.id
            }    
            const spaceToken = await MuxAPI.generateMuxJwt(spaces[roomName])
        
            if (!broadcasts[roomName]) {
                const broadcast = await MuxAPI.createBroadcast(spaces[roomName])
    
                broadcasts[roomName] = broadcast.id
            }
    
            res.json({name: roomName, spaceId: spaces[roomName], spaceToken, broadcastId: broadcasts[roomName]})
        }
        catch(e) {
            console.log("initialize error", e)
            res.status(501).end()
        }
    }

    static async startMuxBroadcast(req, res) {
            // Use broadcast to send live stream, mux will automatically records the live streams
            const {spaceId, broadcastId} = req.body
        
            if ( !spaceId || !broadcastId) res.status(501).end()
        
            try {
                const _ = await MuxAPI.startMuxBroadcast(spaceId, broadcastId)
                res.status(201).end()
            }
            catch(e) {
                console.log("start broadcast error ", e)
                res.status(501).end()
            }
    }

    static async stopMuxBroadcast(req, res) {
        // Use broadcast to record the streams
        const {broadcastId, spaceId} = req.body
    
        if (!broadcastId || !spaceId) res.status(501).end()
    
        try {
            const _ = await MuxAPI.stopMuxBroadcast(spaceId, broadcastId)
            res.status(201).end()
        }
        catch(e) {
            console.log("starMuxBroadcast error", e.response.data)
            res.status(501).end()
        }
    }

    static async muxEvent(req, res) {
        try {
            if (req.body.type === "video.asset.ready") {
                const assetId = req.body.object.id
                await MuxAPI.getAssetUrl(assetId)
            }
            if (req.body.type === "video.asset.master.ready") {
                console.log("event master ready", req.body.data.master.url)
                // TODO: send url to frontend
            }
            res.send(200).end()
        }
        catch(e) {
            res.status(501).end()
        }
    }
}

module.exports = RoomListener;

const { ariaHidden } = require("@mui/material")
const MuxAPI = require("../../api/mux")
const VonageAPI = require("../../api/vonage")

let spaces = {}
let broadcasts = {}
let vonageSessions = {}

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
            
            if (!vonageSessions[roomName]) {
                const session =  await VonageAPI.createVonageSession()
                vonageSessions[roomName] = session
            }
            const vonageToken = await VonageAPI.generateVonageJwt(vonageSessions[roomName].sessionId)

            res.json({
                name: roomName, 
                spaceId: spaces[roomName].id, 
                spaceToken, 
                broadcastId: broadcasts[roomName].id,
                vonageApikey: process.env.VONAGE_API_KEY,
                vonageSessionId: vonageSessions[roomName].sessionId,
                vonageToken
            })
        }
        catch(e) {
            console.log("initialize error", e)
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
                console.log("startMuxBroadcast error: ", e.response.data.error)
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
            console.log("stopMuxBroadcast error: ", e.response.data)
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
    static async startEcRecording(req, res) {
        try {
            const { sessionId, url } = req.body
            console.log("sessionId: ",sessionId, "url:", url)

            if (sessionId && url) {
                // Did not use automatic archive here, to control when the stop archive, 
                // automatic archive will only stop 60s after the last clients disconnect
                const ecId = await VonageAPI.startEcRender(sessionId, url)
                const archiveId = await VonageAPI.startArchive(sessionId) 
            
                res.json({ecId, archiveId})
            }else {
                res.status(500);
            }
          }catch(e) {
            console.log("startEcRecording error: ", e)
            res.status(500).send({ message: e });
          }
    }

    static async stopEcRecording(req, res) {
        try {
            const { ecId, archiveId } = req.body;
            console.log("ecId: ",ecId, "archiveId:", archiveId)
            if (ecId && archiveId) {
                //stop archive
                const archiveData = await VonageAPI.stopArchive(archiveId)
                //stop ec
                const ecData = await VonageAPI.deleteEcRender(ecId)
                res.status(200).json({archiveData, ecData});
            } else {
                res.status(500);
            }
            } catch (e) {
                console.log('stopEcRecording error: ', e)
                res.status(500).send({ message: e });
            }
    }

    static async getVonageRecord(req, res) {
        const archiveId = req.params.archiveId
        try {
            if (!archiveId) {
            res.status(501);
            }
            const url = await VonageAPI.getVonageRecord(archiveId)
            res.json({url})
        }
        catch (e) {
            console.log('getVonageRecord error: ', e)
            res.status(500).send({ message: e });
        }
    }

}

module.exports = RoomListener;

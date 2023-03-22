const axios = require('axios');
const Mux = require('@mux/mux-node');

const { MUX_TOKEN_ID, MUX_TOKEN_SECRET } = process.env;
const { Video } = new Mux(MUX_TOKEN_ID, MUX_TOKEN_SECRET);
const auth = Buffer.from(`${MUX_TOKEN_ID}:${MUX_TOKEN_SECRET}`).toString("base64");


class MuxAPI {
    static async createSpace() {
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

    static async generateMuxJwt(spaceId) {
       return Mux.JWT.signSpaceId(spaceId)
    }

    static async createBroadcast(spaceId) {
        const liveStream = await Video.LiveStreams.create({
            playback_policy: 'public',
            new_asset_settings: { 
                playback_policy: 'public'
            }
        });
        
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

    static async startMuxBroadcast(spaceId, broadcastId) {
        const response = await axios.post(`https://api.mux.com/video/v1/spaces/${spaceId}/broadcasts/${broadcastId}/start`, {
        }, 
        {
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/json',
            }
        })
        return response
    }

    static async stopMuxBroadcast(spaceId, broadcastId) {
        const response = await axios.post(`https://api.mux.com/video/v1/spaces/${spaceId}/broadcasts/${broadcastId}/stop`, {
        }, 
        {
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/json',
            }
        })
        return response
    }

    static async getAssetUrl(assetId) {
        const response = await axios.put(`https://api.mux.com/video/v1/assets/${assetId}/master-access`, {
            "master_access": "temporary"
        }, 
        {
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/json',
            }
        })
        return response
    }  
    
}

module.exports = MuxAPI
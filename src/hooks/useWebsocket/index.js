import { useState } from "react";
const HOST = process.env.REACT_APP_WEBSOCKET || window.location.origin.replace(/^http/, 'ws')

export default function useWebsocket() {
    const [ websocket, setWebsocket ] = useState(null)
    const [ recordedUrl, setRecordedUrl ] = useState(null)

    function initializeWebsocket(roomName) {
        const ws = new WebSocket(`${HOST}?room=${roomName}`);
        ws.onmessage = function (event) {
            console.log("on message", JSON.parse(event.data))
            setRecordedUrl(JSON.parse(event.data).recordedUrl)
        
          };
          ws.onopen = () => {
            console.log("Websocket client connected")
            setWebsocket(ws)
          }
      
    }

    return {websocket , initialize: initializeWebsocket, recordedUrl}
}

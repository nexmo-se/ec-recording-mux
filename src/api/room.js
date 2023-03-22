import MuxCredential from "../entities/MuxCredential";
const apiUrl = process.env.REACT_APP_BACKEND_URL || window.location.href

export default class RoomAPI{

    static async initialize(roomName){
      const response = await fetch(`${apiUrl}initialize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomName })
      })
      if(response.ok){
        const jsonResponse = await response.json();
        const credential = new MuxCredential(jsonResponse.name, jsonResponse.spaceId, jsonResponse.spaceToken, jsonResponse.broadcastId);
        return credential;  
      }else throw new Error(response.statusText);
    }

    static async startMuxBroadcast(room) {
      const response = await fetch(`${apiUrl}startMuxBroadcast`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ broadcastId: room.broadcastId, spaceId: room.spaceId })
      })
      if(response.ok){
        return;  
      }else throw new Error(response.statusText);
    }

    static async stopMuxBroadcast(room) {
      const response = await fetch(`${apiUrl}stopMuxBroadcast`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ broadcastId: room.broadcastId, spaceId: room.spaceId })
      })
      if(response.ok){
        return;  
      }else throw new Error(response.statusText);
    }
}
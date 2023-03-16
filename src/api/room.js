import Room from "../entities/room";
const apiUrl = process.env.REACT_BACKEND_URL || window.location.href

export default class RoomAPI{

    static async initialize(roomName){
      const response = await fetch(`${apiUrl}initialize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomName })
      })
      if(response.ok){
        const jsonResponse = await response.json();
        console.log("json response ", jsonResponse)
        const room = new Room(jsonResponse.spaceId, jsonResponse.spaceToken, jsonResponse.broadcastId);
        return room;  
      }else throw new Error(response.statusText);
    }

    static async startBroadcast(room) {
      const response = await fetch(`${apiUrl}startBroadcast`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ broadcastId: room.broadcastId, spaceId: room.spaceId })
      })
      if(response.ok){
        // const jsonResponse = await response.json();
        // console.log("json response ", jsonResponse)
        return;  
      }else throw new Error(response.statusText);
    }

    static async stopBroadcast(room) {
      const response = await fetch(`${apiUrl}stopBroadcast`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ broadcastId: room.broadcastId, spaceId: room.spaceId })
      })
      if(response.ok){
        // const jsonResponse = await response.json();
        // console.log("json response ", jsonResponse)
        return;  
      }else throw new Error(response.statusText);
    }
}
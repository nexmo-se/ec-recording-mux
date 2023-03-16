import { useCallback, useEffect, useRef, useState } from "react";
import { Space, SpaceEvent, getUserMedia } from "@mux/spaces-web";
import RoomAPI from "./api/room";

import Participant from "./Participant";
import "./App.css";


function App() {
  const spaceRef = useRef(null);
  const [localParticipant, setLocalParticipant] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [room, setRoom] = useState(null);

  const joined = !!localParticipant;

  const addParticipant = useCallback(
    (participant) => {
      setParticipants((currentParticipants) => [
        ...currentParticipants,
        participant,
      ]);
    },
    [setParticipants]
  );

  const removeParticipant = useCallback(
    (participantLeaving) => {
      setParticipants((currentParticipants) =>
        currentParticipants.filter(
          (currentParticipant) =>
            currentParticipant.connectionId !== participantLeaving.connectionId
        )
      );
    },
    [setParticipants]
  );

  useEffect(async () => {
    const roomName = 'test'
    const room = await RoomAPI.initialize(roomName);
    setRoom(room)
    const space = new Space(room.spaceToken);

    space.on(SpaceEvent.ParticipantJoined, addParticipant);
    space.on(SpaceEvent.ParticipantLeft, removeParticipant);

    spaceRef.current = space;

    return () => {
      space.off(SpaceEvent.ParticipantJoined, addParticipant);
      space.off(SpaceEvent.ParticipantLeft, removeParticipant);
    };
  }, [addParticipant, removeParticipant]);

  const join = useCallback(async () => {
    // Join the Space
    let localParticipant = await spaceRef.current.join();

    // Get and publish our local tracks
    let localTracks = await getUserMedia({
      audio: true,
      video: true,
    });
    await localParticipant.publishTracks(localTracks);

    // Set the local participant so it will be rendered
    setLocalParticipant(localParticipant);
  }, []);

  function startBroadcast() {
    RoomAPI.startBroadcast(room);

  }

  function stopBroadcast() {
    RoomAPI.stopBroadcast(room);
  }


  return (
    <div className="App">
      <button onClick={join} disabled={joined}>
        Join Space
      </button>

      <button onClick={startBroadcast} >
        Start broadcast
      </button>

      <button onClick={stopBroadcast} >
        Stop broadcast
      </button>

      {localParticipant && (
        <Participant
          key={localParticipant.connectionId}
          participant={localParticipant}
        />
      )}

      {participants.map((participant) => {
        return (
          <Participant
            key={participant.connectionId}
            participant={participant}
          />
        );
      })}
    </div>
  );
}

export default App;
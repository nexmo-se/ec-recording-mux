import { useEffect, useState, useCallback } from "react";
import { SpaceEvent } from "@mux/spaces-web";
import useVideoContext from "../useVideoContext";

export default function useParticipant() {
    const {room} = useVideoContext()
    const [participants, setParticipants] = useState([])

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

      useEffect(() => {
        if (room) {        
            room.on(SpaceEvent.ParticipantJoined, addParticipant);
            room.on(SpaceEvent.ParticipantLeft, removeParticipant);
        
            return () => {
              room.off(SpaceEvent.ParticipantJoined, addParticipant);
              room.off(SpaceEvent.ParticipantLeft, removeParticipant);
            };
        }

      }, [room, addParticipant, removeParticipant])

    return {
        participants
    }
}
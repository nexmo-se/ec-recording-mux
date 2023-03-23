import { Space, SpaceEvent } from "@mux/spaces-web";
import { useState, useEffect, useCallback } from "react";
import { useAppState } from "../../../state";

export default function useRoom(onError) {
    const [ room, setRoom] = useState(null);
    const [ isConnecting, setIsConnecting] = useState(false);
    const [ participants, setParticipants] = useState([])
    const [ isRecording, setIsRecording ] = useState(false)

    const { user } = useAppState()

    const connect = useCallback(
      (token) => {
        setIsConnecting(true);
        const space = new Space(token, {displayName: user.displayName})
        setRoom(space)
        setIsConnecting(false);
      },
      [user]
    );

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

    const updateRecordingState = useCallback(
      (recordingState) => {
        setIsRecording(recordingState)
      },
      [setIsRecording]
    );

    useEffect(() => {
      if (room) {        
          room.on(SpaceEvent.ParticipantJoined, addParticipant);
          room.on(SpaceEvent.ParticipantLeft, removeParticipant);
          room.on(SpaceEvent.BroadcastStateChanged, updateRecordingState);
      
          return () => {
            room.off(SpaceEvent.ParticipantJoined, addParticipant);
            room.off(SpaceEvent.ParticipantLeft, removeParticipant);
            room.off(SpaceEvent.BroadcastStateChanged, updateRecordingState);
          };
      }

    }, [room, addParticipant, removeParticipant, updateRecordingState])


  
    return { room, isConnecting, connect, participants, isRecording };
  }
import { Space, SpaceEvent, LocalParticipant } from "@mux/spaces-web";
import OT from '@opentok/client';
import { useState, useEffect, useCallback } from "react";

export default function useRoom(onError) {
    const [ room, setRoom] = useState(null);
    const [ isConnecting, setIsConnecting] = useState(false);
    const [ isVonageConnecting, setIsVonageConnecting] = useState(false);
    const [ participants, setParticipants] = useState([])
    const [ activeSpeaker, setActiveSpeaker] = useState(null)
    const [ isRecording, setIsRecording ] = useState(false)
    const [ vonageSession, setVonageSession] = useState(null)
    const [ isEcRecording, setIsEcRecording ] = useState(false)
    const [ isVonageVideoAvailable, setIsVonageVideoAvailable ] = useState(false)
    const [ recordedArchiveId, setRecordedArchiveId ] = useState(null)

    const connect = (token, username) => {
      if (isConnecting || room) return;
        setIsConnecting(true);
        const space = new Space(token, {displayName: username})
        setRoom(space)
        setIsConnecting(false);
    }


    const vonageConnect = (apiKey, sessionId, token) => {
      if (isVonageConnecting || vonageSession) return;
      setIsVonageConnecting(true);
      var session = OT.initSession(apiKey, sessionId);
      session.connect(token, function(error) {
        if (error) {
          console.log('Error connecting: ', error.name, error.message);
        } else {
          console.log('Connected to vonage session.');
          setVonageSession(session);
        }
        setIsVonageConnecting(false);
      });
    };

    const addParticipant = useCallback(
      (participant) => {
        if (!participant.displayName) return;
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

    const updateActiveSpeaker = useCallback(
      (activeSpeakers) => {
        const participantsActiveSpeaker = activeSpeakers.filter((activeSpeaker) =>  !(activeSpeaker.participant instanceof LocalParticipant))
        if (participantsActiveSpeaker.length > 0) {
          setActiveSpeaker(participantsActiveSpeaker[0].participant)
        }
      },
      [setActiveSpeaker]
    )

    useEffect(() => {
      if (participants.length === 0) {
        setActiveSpeaker(null)
        return;
      }
      const participantsIds = participants.map((participants) => participants.id)

      if (!activeSpeaker || !participantsIds.includes(activeSpeaker.id)) {
        setActiveSpeaker(participants[0])
      }

    }, [participants, activeSpeaker])


    useEffect(() => {
      if (room) {        
          room.on(SpaceEvent.ParticipantJoined, addParticipant);
          room.on(SpaceEvent.ActiveSpeakersChanged, updateActiveSpeaker);
          room.on(SpaceEvent.ParticipantLeft, removeParticipant);
          room.on(SpaceEvent.BroadcastStateChanged, updateRecordingState);
      
          return () => {
            room.off(SpaceEvent.ActiveSpeakersChanged, updateActiveSpeaker);
            room.off(SpaceEvent.ParticipantJoined, addParticipant);
            room.off(SpaceEvent.ParticipantLeft, removeParticipant);
            room.off(SpaceEvent.BroadcastStateChanged, updateRecordingState);
          };
      }

    }, [room, addParticipant, removeParticipant, updateRecordingState, updateActiveSpeaker])


    const handleEcRecordingStarted = useCallback(() => {

      setIsEcRecording(true)
    }, [setIsEcRecording])

    const handleEcRecordingStopped = useCallback((archive) => {
      setIsEcRecording(false)
      setRecordedArchiveId(archive.id)
      setTimeout(() => {
        setIsVonageVideoAvailable(true); // Ensure video is uploaded
      }, 5000);
    }, [setIsEcRecording, setIsVonageVideoAvailable])

    useEffect(() => {
      if (vonageSession) {
        vonageSession.on('archiveStarted', handleEcRecordingStarted);
        vonageSession.on('archiveStopped', handleEcRecordingStopped);
  
        return () => {
          vonageSession.off('archiveStarted', handleEcRecordingStarted);
          vonageSession.off('archiveStopped', handleEcRecordingStopped);
        };
      }
    }, [vonageSession, handleEcRecordingStarted, handleEcRecordingStopped]);


    return { 
      room, 
      isConnecting, 
      connect, 
      participants, 
      isRecording, 
      isVonageConnecting, 
      vonageConnect,
      vonageSession,
      isEcRecording,
      isVonageVideoAvailable,
      activeSpeaker, 
      recordedArchiveId };
  }
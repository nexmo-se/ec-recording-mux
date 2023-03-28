import { useCallback, useEffect, useState } from "react";
import { getUserMedia } from "@mux/spaces-web";
import useVideoContext from "../../hooks/useVideoContext";
import Participant from "../Participant"
import MenuBar from "../MenuBar";
import styles from './styles.module.css'
import { Tooltip, Typography } from "@mui/material";
import useWebsocket from "../../hooks/useWebsocket";
import { useAppState } from "../../state";

export default function MainScreen() {
    const [localParticipant, setLocalParticipant] = useState(null);
    const { room, participants, isRecording, isEcRecording } = useVideoContext();
    const { ecRender } = useAppState
    const { initialize: initializeWebsocket, recordedUrl, isWebsocketConnecting, websocket } = useWebsocket()
    const roomName = window.location.pathname.split('/').pop()

    const join = useCallback(async () => {
      // Join the Space
      let localParticipant = await room.join();
       
      // Get and publish our local tracks
      let localTracks = await getUserMedia({
        audio: true,
        video: true,
      });

      await localParticipant.publishTracks(localTracks);

      // Set the local participant so it will be rendered
      setLocalParticipant(localParticipant);
   }, [room])

    useEffect(() => {
      if (room) {
        join()
      }
    }, [room, join])

    useEffect(() => {
      if (!ecRender && !websocket && !isWebsocketConnecting) {
        initializeWebsocket(roomName)
      }

    }, [ecRender, roomName, initializeWebsocket, isWebsocketConnecting, websocket ])

    return(
        <div>
          <h4 className={styles.roomTitle}>Space: {roomName}</h4>
            <div className={styles.gridContainer}>
              {localParticipant && (
                  <Participant
                  key={localParticipant.connectionId}
                  participant={localParticipant}
                  />
              )}
              {participants.map((participant, index) => {
                  return (
                  <Participant
                      key={participant.connectionId}
                      participant={participant}
                      index={index}
                  />
                  );
              })}
            </div>
            {isRecording && (
              <Tooltip
                title="All participants' audio and video is currently being recorded. Visit the app settings to stop recording."
                placement="top"
              >
                <div className={styles.recordingIndicator}>
                  <div className={styles.circle}></div>
                  <Typography variant="body1" color="inherit" data-cy-recording-indicator>
                    Recording
                  </Typography>
                </div>
              </Tooltip>
            )}
            {isEcRecording && (
              <Tooltip
                title="All participants' audio and video is currently being recorded. Visit the app settings to stop recording."
                placement="top"
              >
                <div className={styles.recordingIndicator}>
                  <div className={styles.circle}></div>
                  <Typography variant="body1" color="inherit" data-cy-recording-indicator>
                    EC Recording
                  </Typography>
                </div>
              </Tooltip>
            )}
            <MenuBar
              recordedUrl={recordedUrl}
            ></MenuBar>
        </div>
    )
}
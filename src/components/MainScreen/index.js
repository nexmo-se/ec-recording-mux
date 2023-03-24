import { useCallback, useEffect, useState } from "react";
import { getUserMedia } from "@mux/spaces-web";
import useVideoContext from "../../hooks/useVideoContext";
import Participant from "../Participant"
import MenuBar from "../MenuBar";
import styles from './styles.module.css'
import { Tooltip, Typography } from "@mui/material";
import useWebsocket from "../../hooks/useWebsocket";

export default function MainScreen() {
    const [localParticipant, setLocalParticipant] = useState(null);
    const { room, participants, isRecording, isEcRecording } = useVideoContext();
    const { initialize: initializeWebsocket, recordedUrl } = useWebsocket()
    const searchParams = new URLSearchParams(document.location.search);
    const role = searchParams.get('role');
    const roomName = window.location.pathname.split('/').pop()

    const join = useCallback(async () => {
      // Join the Space
      let localParticipant = await room.join();

      if (role === process.env.REACT_APP_EC_NAME) {
        return;
      }
       
      // Get and publish our local tracks
      let localTracks = await getUserMedia({
        audio: true,
        video: true,
      });

      await localParticipant.publishTracks(localTracks);

      // Set the local participant so it will be rendered
      setLocalParticipant(localParticipant);
   }, [room, role])

    useEffect(() => {
      if (room) {
        join()
        initializeWebsocket(roomName)
      }
      // eslint-disable-next-line
    }, [room, join])

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
                    Ec Recording
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
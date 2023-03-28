import { useCallback, useEffect, useState } from "react";
import { getUserMedia } from "@mux/spaces-web";
import useVideoContext from "../../hooks/useVideoContext";
import Participant from "../Participant"
import MenuBar from "../MenuBar";
import styles from './styles.module.css'
import { Tooltip, Typography } from "@mui/material";
import useWebsocket from "../../hooks/useWebsocket";
import { useAppState } from "../../state";
import debounce from "lodash/debounce";

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

    function recalculateLayout() {
      const gallery = document.getElementById("gallery");
      const aspectRatio = 16 / 9;
      const screenWidth = document.body.getBoundingClientRect().width;
      const screenHeight = document.body.getBoundingClientRect().height - 120;
      const videoCount = gallery.getElementsByTagName("video").length;
    
      // or use this nice lib: https://github.com/fzembow/rect-scaler
      function calculateLayout( containerWidth,  containerHeight, videoCount,  aspectRatio) {
        let bestLayout = {
          area: 0,
          cols: 0,
          rows: 0,
          width: 0,
          height: 0
        };
    
        // brute-force search layout where video occupy the largest area of the container
        for (let cols = 1; cols <= videoCount; cols++) {
          const rows = Math.ceil(videoCount / cols);
          const hScale = containerWidth / (cols * aspectRatio);
          const vScale = containerHeight / rows;
          let width;
          let height;
          if (hScale <= vScale) {
            width = Math.floor(containerWidth / cols) - 10;
            height = Math.floor(width / aspectRatio) - 10;
          } else {
            height = Math.floor(containerHeight / rows) - 10;
            width = Math.floor(height * aspectRatio) - 10;
          }
          const area = width * height;
          if (area > bestLayout.area) {
            bestLayout = {
              area,
              width,
              height,
              rows,
              cols
            };
          }
        }
        return bestLayout;
      }
    
      const { width, height, cols } = calculateLayout(
        screenWidth,
        screenHeight,
        videoCount,
        aspectRatio
      );
    
      gallery.style.setProperty("--width", width + "px");
      gallery.style.setProperty("--height", height + "px");
      gallery.style.setProperty("--cols", cols + "");
    }

    const debouncedRecalculateLayout = debounce(recalculateLayout, 50);

    useEffect(() => {
      debouncedRecalculateLayout()
    }, [participants, localParticipant])

    return(
        <div>
          <h4 className={styles.roomTitle}>Space: {roomName}</h4>
            <div className={styles.gridContainer} id="gallery">
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
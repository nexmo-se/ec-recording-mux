import { useCallback, useEffect, useState } from "react";
import { getUserMedia } from "@mux/spaces-web";
import useVideoContext from "../../hooks/useVideoContext";
import useParticipant from "../../hooks/useParticipant";
import Participant from "../Participant"
import MenuBar from "../MenuBar";
import styles from './styles.module.css'

export default function MainScreen() {
    const [localParticipant, setLocalParticipant] = useState(null);
    const { participants } = useParticipant()
    const { room } = useVideoContext();

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

    return(
        <div>
          <h4 className={styles.roomTitle}>Space: {window.location.pathname.split('/').pop()}</h4>
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
            <MenuBar></MenuBar>
        </div>
    )
}
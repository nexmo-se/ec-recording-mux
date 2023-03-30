import { useCallback, useEffect, useRef, useState } from "react";
import { LocalParticipant, ParticipantEvent, TrackKind, TrackSource} from "@mux/spaces-web";
import styles from './styles.module.css';
import PersonIcon from '@mui/icons-material/Person';
import VolumeOffIcon from "@mui/icons-material/VolumeOffOutlined";

const Participant = ({ participant, isActiveSpeaker=false }) => {
  const mediaEl = useRef(null);
  const isLocal = participant instanceof LocalParticipant;
  const [videoMuted, setIsVideoMuted] = useState(false)
  const [audioMuted, setIsAudioMuted] = useState(false)

  const attachTrack = useCallback((track) => {
    track.attach(mediaEl.current);
  }, []);

  const detachTrack = useCallback((track) => {
    track.detach(mediaEl.current);
  }, []);

  const muteTrack = useCallback((track) => {
    if (track.getKind() === TrackKind.Video) {
      setIsVideoMuted(true)
    }
    else if (track.getKind() === TrackKind.Audio) {
      setIsAudioMuted(true)
    }
    detachTrack(track)
  }, [detachTrack]);

  const unMuteTrack = useCallback((track) => {
    if (track.getKind() === TrackKind.Video) {
      setIsVideoMuted(false)
    }
    else if (track.getKind() === TrackKind.Audio) {
      setIsAudioMuted(false)
    }
    attachTrack(track)
  }, [attachTrack]);


  useEffect(() => {
    if (!mediaEl.current) return;

    const microphoneTrack = participant
      .getAudioTracks()
      .find((audioTrack) => audioTrack.source === TrackSource.Microphone);

    const cameraTrack = participant
      .getVideoTracks()
      .find((videoTrack) => videoTrack.source === TrackSource.Camera);

    if (microphoneTrack) {
      if (microphoneTrack.isMuted()) {
        setIsAudioMuted(true)
      }
      else {
        attachTrack(microphoneTrack);
      }
    }

    if (cameraTrack) {
      if (cameraTrack.isMuted()) {
        setIsVideoMuted(true)
      }
      else {
        attachTrack(cameraTrack);
      }
    }


    participant.on(ParticipantEvent.TrackSubscribed, attachTrack);
    participant.on(ParticipantEvent.TrackUnsubscribed, detachTrack);
    participant.on(ParticipantEvent.TrackMuted, muteTrack);
    participant.on(ParticipantEvent.TrackUnmuted, unMuteTrack);

    return () => {
      participant.off(ParticipantEvent.TrackSubscribed, attachTrack);
      participant.off(ParticipantEvent.TrackUnsubscribed, detachTrack);
      participant.off(ParticipantEvent.TrackMuted, muteTrack);
      participant.off(ParticipantEvent.TrackUnmuted, unMuteTrack);
    };
  }, [participant, attachTrack, detachTrack, muteTrack, unMuteTrack]);

  if (participant.displayName === process.env.REACT_APP_EC_NAME) 
  return null;
  
  return (
    <div className={`${styles.container} ${isActiveSpeaker ? styles.isActiveSpeaker : ''}`}>
      <video
        ref={mediaEl}
        autoPlay
        playsInline
        muted={isLocal}
        className={styles.video}
      />
      { videoMuted && (
          <div className={styles.avatar}>
              <PersonIcon style={{width: '90%', height: '90%', color: 'white'}}></PersonIcon>
          </div>
        )
      }
      <h2  className={styles.name}>{participant.displayName}</h2>
      { audioMuted && (
        <div className={styles.volumeIndicator}>
           <VolumeOffIcon style={{width: '24px', height: '24px', color: 'red'}}></VolumeOffIcon>
        </div>
        )
      }
    </div>
  );
};

export default Participant;
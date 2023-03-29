import React, { createContext, useCallback } from 'react';
import useRoom from './useRoom';


export const VideoContext = createContext(null);

export function VideoProvider({children, onError = () => {} }) {
  const onErrorCallback = useCallback(
    error => {
      console.log(`ERROR: ${error}`);
      onError(error);
    },
    [onError]
  );

  const { room, 
    isConnecting, 
    connect, 
    participants, 
    isRecording,
    isVonageConnecting, 
    vonageConnect,
    vonageSession,
    isEcRecording,
    isVonageVideoAvailable,
    activeSpeaker  } = useRoom(onErrorCallback);

  return (
    <VideoContext.Provider
      value={{
        room,
        isConnecting,
        onError: onErrorCallback,
        connect,
        participants,
        isRecording,
        isVonageConnecting, 
        vonageConnect,
        vonageSession,
        isEcRecording,
        isVonageVideoAvailable,
        activeSpeaker
      }}
    >
        {children}
    </VideoContext.Provider>
  );
}

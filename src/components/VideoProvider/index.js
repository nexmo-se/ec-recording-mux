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

  const { room, isConnecting, connect } = useRoom(onErrorCallback);

  return (
    <VideoContext.Provider
      value={{
        room,
        isConnecting,
        onError: onErrorCallback,
        connect,
      }}
    >
        {children}
    </VideoContext.Provider>
  );
}

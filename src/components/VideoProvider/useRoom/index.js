import { Space } from "@mux/spaces-web";
import { useState, useCallback } from "react";
import { useAppState } from "../../../state";

export default function useRoom(onError) {
    const [ room, setRoom] = useState(null);
    const [ isConnecting, setIsConnecting] = useState(false);
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

  
    return { room, isConnecting, connect };
  }
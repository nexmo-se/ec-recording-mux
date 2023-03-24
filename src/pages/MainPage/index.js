import { useEffect, useState, useCallback } from "react";
import PreJoinScreen from "../../components/PreJoinScreen";
import MainScreen from "../../components/MainScreen";
import useVideoContext from "../../hooks/useVideoContext";
import { useAppState } from "../../state";

export default function MainPage() {
    const { room, connect, vonageConnect } = useVideoContext();
    const { initialize, user, isAuthReady } = useAppState();
    const [roomName, setRoomName] = useState(window.location.pathname.split('/').pop());
    const searchParams = new URLSearchParams(document.location.search);
    const role = searchParams.get('role');

    const handleSubmit = async (event) => {
        event.preventDefault();
        connectRoom(user.displayName)
    };

    const connectRoom = useCallback(async (username) => {
      const credential = await initialize(username ,roomName);
      await connect(credential.spaceToken)
      await vonageConnect(credential.vonageApikey, credential.vonageSessionId, credential.vonageToken)
      window.history.replaceState(null, '', window.encodeURI(`/room/${roomName}${window.location.search || ''}`));
  
    },[roomName, connect, vonageConnect, initialize])

    useEffect(() => {
      if (role === process.env.REACT_APP_EC_NAME && roomName && isAuthReady) {
        connectRoom(role)
      }
    }, [role, roomName, isAuthReady]);

    return (
        <>
          {room === null ? (
            <PreJoinScreen
                roomName={roomName}
                setRoomName={setRoomName}
                handleSubmit={handleSubmit}
             />
          ) : (
            <MainScreen/>
          )}
          </>
      );
}
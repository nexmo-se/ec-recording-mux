import { useState } from "react";
import PreJoinScreen from "../../components/PreJoinScreen";
import MainScreen from "../../components/MainScreen";
import useVideoContext from "../../hooks/useVideoContext";
import { useAppState } from "../../state";
import RoomAPI from "../../api/room";

export default function MainPage() {
    const { room, connect } = useVideoContext();
    const { user } = useAppState();
    const [name, setName] = useState(user?.displayName || '');
    const [roomName, setRoomName] = useState('');
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        const credential = await RoomAPI.initialize(roomName);
        await connect(credential.spaceToken)
        window.history.replaceState(null, '', window.encodeURI(`/room/${roomName}${window.location.search || ''}`));

    };

    return (
        <>
          {room === null ? (
            <PreJoinScreen
                name={name}
                roomName={roomName}
                setName={setName}
                setRoomName={setRoomName}
                handleSubmit={handleSubmit}
             />
          ) : (
            <MainScreen/>
          )}
          </>
      );
}
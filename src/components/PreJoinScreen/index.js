import { useRef, useEffect } from "react";
import IntroContainer from "../IntroContainer";
import { useAppState } from "../../state";
import { Typography, InputLabel, TextField, Grid, Button } from "@mui/material";
import styles from './styles.module.css'

export default function PreJoinScreen({roomName, setRoomName, handleSubmit}) {
  const { isFetching, ecRender } = useAppState();
  const formRef = useRef();

    const handleRoomNameChange = (event) => {
        setRoomName(event.target.value);
    };

    useEffect(() => {
        if (roomName) {
            setRoomName(roomName);
        }
    }, [roomName, setRoomName]);

    if (ecRender) {
        return null;
    }

    return (
        <IntroContainer>
            <Typography variant="h5" className={styles.gutterBottom}>
                Join a Room
            </Typography>
            <Typography variant="body1">
                Enter the name of a room you'd like to join.
            </Typography>
            <form ref={formRef} onSubmit={handleSubmit}>
                <div className={styles.inputContainer}>
                <div className={styles.textFieldContainer}>
                    <InputLabel shrink htmlFor="input-room-name">
                    Room Name
                    </InputLabel>
                    <TextField
                    autoCapitalize="false"
                    id="input-room-name"
                    variant="outlined"
                    fullWidth
                    size="small"
                    value={roomName}
                    onChange={handleRoomNameChange}
                    />
                </div>
                </div>
                <Grid container justifyContent="flex-end">
                <Button
                    variant="contained"
                    type="submit"
                    color="primary"
                    disabled={!roomName || isFetching}
                >
                    Continue
                </Button>
                </Grid>
            </form>
        </IntroContainer>
      );
}
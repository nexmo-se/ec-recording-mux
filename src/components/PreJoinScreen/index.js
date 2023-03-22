import IntroContainer from "../IntroContainer";
import { useAppState } from "../../state";
import { Typography, InputLabel, TextField, Grid, Button } from "@mui/material";
import styles from './styles.module.css'

export default function PreJoinScreen({name, setName, roomName, setRoomName, handleSubmit}) {
  const { user } = useAppState();

    const handleNameChange = (event) => {
        setName(event.target.value);
      };
    
    const handleRoomNameChange = (event) => {
    setRoomName(event.target.value);
    };
    
    return (
        <IntroContainer>
            <Typography variant="h5" className={styles.gutterBottom}>
                Join a Room
            </Typography>
            <Typography variant="body1">
                {user?.displayName
                ? "Enter the name of a room you'd like to join."
                : "Enter your name and the name of a room you'd like to join"}
            </Typography>
            <form onSubmit={handleSubmit}>
                <div className={styles.inputContainer}>
                {!user?.displayName && (
                    <div className={styles.textFieldContainer}>
                    <InputLabel shrink htmlFor="input-user-name">
                        Your Name
                    </InputLabel>
                    <TextField
                        id="input-user-name"
                        variant="outlined"
                        fullWidth
                        size="small"
                        value={name}
                        onChange={handleNameChange}
                    />
                    </div>
                )}
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
                    disabled={!name || !roomName}
                >
                    Continue
                </Button>
                </Grid>
            </form>
        </IntroContainer>
      );
}
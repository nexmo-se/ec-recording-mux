import { useState } from "react";
import RoomAPI from "../../api/room";
import { useAppState } from "../../state";
import useVideoContext from "../../hooks/useVideoContext";
import styles from './styles.module.css'
import { Button, Menu, MenuList, MenuItem, ListItemText, ListItemIcon, Divider } from "@mui/material";
import StartRecordingIcon from '../../icons/StartRecordingIcon';
import StopRecordingIcon from '../../icons/StopRecordingIcon';
import LogoutIcon from '@mui/icons-material/Logout';

export default function MenuBar() {
    const { room } = useVideoContext();
    const {signOut } = useAppState();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl)

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    function logout() {
        signOut()
      }
    
      function startMuxBroadcast() {
        RoomAPI.startMuxBroadcast(room);
    
      }
    
      function stopMuxBroadcast() {
        RoomAPI.stopMuxBroadcast(room);
      }
    
    return (
        <div className={styles.menuBar}>
            <Button
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                color="secondary" 
                variant="contained"
                onClick={handleClick}
            >
                Settings
            </Button>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                'aria-labelledby': 'basic-button',
                }}>
                <MenuList>
                    <MenuItem onClick={handleClose}>
                        <ListItemIcon>
                            <StartRecordingIcon />
                        </ListItemIcon>
                        <ListItemText>Start Recording</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
                        <ListItemIcon>
                            <StartRecordingIcon />
                        </ListItemIcon>
                        <ListItemText>Start EC Recording</ListItemText>
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={logout}>
                        <ListItemIcon>
                            <LogoutIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Log Out</ListItemText>
                    </MenuItem>
                </MenuList>
            </Menu>
        </div>
    )
}
import { useCallback, useEffect, useState } from "react";
import { useAppState } from "../../state";
import useVideoContext from "../../hooks/useVideoContext";
import styles from './styles.module.css'
import { Button, Menu, MenuList, MenuItem, ListItemText, ListItemIcon, Divider } from "@mui/material";
import StartRecordingIcon from '../../icons/StartRecordingIcon';
import StopRecordingIcon from '../../icons/StopRecordingIcon';
import LogoutIcon from '@mui/icons-material/Logout';
import CloudDownloadOutlinedIcon from "@mui/icons-material/CloudDownloadOutlined";
import RecordingNotification from "../RecordingNotification";

export default function MenuBar({recordedUrl}) {
    const { isRecording } = useVideoContext();
    const {signOut, startRecording, stopRecording, isFetching } = useAppState();
    const [anchorEl, setAnchorEl] = useState(null);
    const [openNotification, setOpenNotification] = useState(false)
    const [notificationMessage, setNotificationMessage] = useState('')
    const open = Boolean(anchorEl)

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    function logout() {
        signOut()
        handleClose()
    }

    const muxRecording = useCallback(() => {
        if (isRecording) {
            stopRecording();
            setNotificationMessage('Recording Stopped')
            setOpenNotification(true)
        }
        else {
            startRecording();
            setNotificationMessage('Recording Start')
            setOpenNotification(true)
        }
        handleClose();

    }, [isRecording, startRecording, stopRecording])


    function downloadRecord(url) {
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'download');
        link.target = "_blank"
  
        document.body.appendChild(link);
  
        link.click();
        link.parentNode?.removeChild(link);
  
        window.URL.revokeObjectURL(url);
        handleClose();
    }
    
    return (
        <>
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
                    <MenuItem onClick={muxRecording} disabled={isFetching}>
                        <ListItemIcon>
                            {isRecording ? <StopRecordingIcon/> : <StartRecordingIcon />}
                        </ListItemIcon>
                        <ListItemText>{isRecording ? 'Stop' : 'Start'} Recording</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={handleClose} disabled={isFetching}>
                        <ListItemIcon>
                            <StartRecordingIcon />
                        </ListItemIcon>
                        <ListItemText>{isRecording ? 'Stop' : 'Start'} EC Recording</ListItemText>
                    </MenuItem>
                    {recordedUrl && (
                        <MenuItem onClick={() => downloadRecord(recordedUrl)} disabled={isFetching}>
                            <ListItemIcon>
                                <CloudDownloadOutlinedIcon />
                            </ListItemIcon>
                            <ListItemText>Download Record</ListItemText>
                        </MenuItem>
                    )
                    }
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
        <RecordingNotification 
            openNotification={openNotification}
            setOpenNotification={setOpenNotification}
            message={notificationMessage}>
        </RecordingNotification>
        </>
    )
}
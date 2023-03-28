import { useCallback, useState } from "react";
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
    const { isRecording, isEcRecording, isVonageVideoAvailable } = useVideoContext();
    const {signOut, startRecording, stopRecording, startEcRecording, stopEcRecording, isFetching, getVonageRecord } = useAppState();
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
            setNotificationMessage('Recording Stopped, You may download the record from the Settings in a few seconds.')
            setOpenNotification(true)
        }
        else {
            startRecording();
            setNotificationMessage('Recording Request Submitted. You should see a recording indicator in a few seconds.')
            setOpenNotification(true)
        }
        handleClose();

    }, [isRecording, startRecording, stopRecording])

    const ecRecording = useCallback(async () => {
        if (isEcRecording) {
            stopEcRecording();
            setNotificationMessage('EC Recording Stopped, You may download the record from the Settings in a few seconds.')
            setOpenNotification(true)
        }
        else {
            startEcRecording();
            setNotificationMessage('EC Recording Request Submitted. You should see a EC recording indicator in a few seconds.')
            setOpenNotification(true)
        }
        handleClose();

    }, [isEcRecording, startEcRecording, stopEcRecording])


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

    async function downloadVonageRecord() {
          const url = await getVonageRecord()
          if (typeof url === 'string') {
            downloadRecord(url)
          }
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
                    {!isEcRecording && (
                        <MenuItem onClick={muxRecording} disabled={isFetching}>
                            <ListItemIcon>
                                {isRecording ? <StopRecordingIcon/> : <StartRecordingIcon />}
                            </ListItemIcon>
                            <ListItemText>{isRecording ? 'Stop' : 'Start'} Recording</ListItemText>
                        </MenuItem>
                    )}
                    {!isRecording && (
                        <MenuItem onClick={ecRecording} disabled={isFetching}>
                            <ListItemIcon>
                                <StartRecordingIcon />
                            </ListItemIcon>
                            <ListItemText>{isEcRecording ? 'Stop' : 'Start'} EC Recording</ListItemText>
                        </MenuItem>
                        )
                    }
                    {recordedUrl && (
                        <MenuItem onClick={() => downloadRecord(recordedUrl)} disabled={isFetching}>
                            <ListItemIcon>
                                <CloudDownloadOutlinedIcon />
                            </ListItemIcon>
                            <ListItemText>Download Record</ListItemText>
                        </MenuItem>
                    )
                    }
                    {
                    isVonageVideoAvailable && (
                        <MenuItem onClick={() => downloadVonageRecord()} disabled={isFetching}>
                        <ListItemIcon>
                            <CloudDownloadOutlinedIcon/>
                        </ListItemIcon>
                        <ListItemText>Download Vonage Record</ListItemText>
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
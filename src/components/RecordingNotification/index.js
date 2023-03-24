import { IconButton, Snackbar } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

export default function RecordingNotification({openNotification, setOpenNotification, message}) {

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpenNotification(false);
      };

    const action = (
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
      );

    return (
        <div>
          <Snackbar
            open={openNotification}
            autoHideDuration={6000}
            onClose={handleClose}
            message={message}
            action={action}
            anchorOrigin={{ vertical:'top', horizontal: 'right' }}
          />
        </div>
      );
}
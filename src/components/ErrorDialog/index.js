import React from 'react';
import { Button, Dialog, DialogContent, DialogActions, DialogTitle, DialogContentText } from '@mui/material';


export default function ErrorDialog({ dismissError, error }) {

  return (
    <Dialog open={error !== null} onClose={() => dismissError()} fullWidth={true} maxWidth="xs">
      <DialogTitle>ERROR</DialogTitle>
      <DialogContent>
        <DialogContentText>{error}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => dismissError()} color="primary" autoFocus>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}
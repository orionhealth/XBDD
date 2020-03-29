import React, { FC } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@material-ui/core';

interface Props {
  open: boolean;
  title: string;
  msg: string;
  handleConfirmed: (event: React.MouseEvent) => void;
  handleClosed: (event: React.MouseEvent) => void;
}

const ConfirmationDialog: FC<Props> = props => {
  const { open, title, msg, handleConfirmed, handleClosed } = props;

  return (
    <Dialog open={open} onClose={handleClosed}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{msg}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClosed} variant="contained">
          Cancel
        </Button>
        <Button onClick={handleConfirmed} variant="contained" color="primary">
          Hell Yeah
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;

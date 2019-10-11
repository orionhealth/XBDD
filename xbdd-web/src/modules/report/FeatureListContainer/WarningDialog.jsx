import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@material-ui/core";

const WarningDialog = props => {
  const { open, msg, handler, handleClosed } = props;

  return (
    <Dialog open={open} onClose={handleClosed}>
      <DialogTitle>Warning!!!</DialogTitle>
      <DialogContent>
        <DialogContentText>{msg}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClosed} color="primary">
          Cancel
        </Button>
        <Button onClick={handler} color="primary" autoFocus>
          Hell Yeah
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WarningDialog;

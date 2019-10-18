import React from "react";
import { PropTypes } from "prop-types";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@material-ui/core";

const ConfirmationDialog = props => {
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

ConfirmationDialog.propTypes = {
  open: PropTypes.bool,
  title: PropTypes.string,
  msg: PropTypes.string,
  handleConfirmed: PropTypes.func.isRequired,
  handleClosed: PropTypes.func.isRequired,
};

export default ConfirmationDialog;

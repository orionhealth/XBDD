import React from "react";
import { PropTypes } from "prop-types";
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

WarningDialog.propTypes = {
  open: PropTypes.bool,
  msg: PropTypes.string,
  handler: PropTypes.func.isRequired,
  handleClosed: PropTypes.func.isRequired,
  classes: PropTypes.shape({}),
};

export default WarningDialog;

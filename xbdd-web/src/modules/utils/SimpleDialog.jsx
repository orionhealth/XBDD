import React from "react";
import { PropTypes } from "prop-types";
import { Dialog, DialogTitle, DialogContent, Box } from "@material-ui/core";
import { Cancel } from "@material-ui/icons";

const SimpleDialog = props => {
  const { open, title, content, handleClosed } = props;

  return (
    <Dialog open={open} onClose={handleClosed} maxWidth={false}>
      <DialogTitle>
        <Box display="flex">
          <Box flexGrow={1}>{title}</Box>
          <Box>
            <Cancel onClick={handleClosed} />
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent>{content}</DialogContent>
    </Dialog>
  );
};

SimpleDialog.propTypes = {
  open: PropTypes.bool,
  content: PropTypes.shape({}),
  handleClosed: PropTypes.func.isRequired,
  classes: PropTypes.shape({}),
};

export default SimpleDialog;

import React from "react";
import { Dialog, DialogTitle, DialogContent, Box } from "@material-ui/core";
import { Cancel } from "@material-ui/icons";

type Props = {
  open: boolean;
  title: string;
  content: string;
  handleClosed: (event: React.MouseEvent) => void;
};

const SimpleDialog = (props: Props) => {
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

export default SimpleDialog;

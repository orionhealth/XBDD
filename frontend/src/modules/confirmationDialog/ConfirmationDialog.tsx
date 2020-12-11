import React, { FC, MouseEvent } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

interface Props {
  open: boolean;
  title: string;
  msg: string;
  handleConfirmed: (e: MouseEvent) => void;
  handleClosed: (e: MouseEvent) => void;
}

const ConfirmationDialog: FC<Props> = props => {
  const { t } = useTranslation();
  const { open, title, msg, handleConfirmed, handleClosed } = props;

  return (
    <Dialog open={open} onClose={handleClosed}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{msg}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClosed} variant="contained">
          {t(`dialog.cancel`)}
        </Button>
        <Button onClick={handleConfirmed} variant="contained" color="primary">
          {t(`dialog.yes`)}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;

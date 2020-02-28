import React from 'react';
import { Snackbar } from '@material-ui/core';
import { MuiAlert } from '@material-ui/lab';

const Notifications: FC<{}> = () => {
  return (
    <Snackbar
      open
      onClose={(): void => {
        this.setState({ error: null });
      }}
    >
      <MuiAlert elevation={6} variant="filled" severity="error">
        {t('errors.unexpected')}
      </MuiAlert>
    </Snackbar>
  );
};

export default Notifications;

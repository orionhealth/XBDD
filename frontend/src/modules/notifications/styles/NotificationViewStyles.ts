import { createStyles, makeStyles } from '@material-ui/core';

export const useNotificationViewStyles = makeStyles(() =>
  createStyles({
    root: {
      position: 'fixed',
      left: 10,
      bottom: 5,
    },
    alert: {
      marginBottom: 5,
    },
  })
);

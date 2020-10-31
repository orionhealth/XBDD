import { createStyles, makeStyles } from '@material-ui/core';

export const useLoginDialogStyles = makeStyles(() =>
  createStyles({
    columnDisplay: {
      display: 'flex',
      flexDirection: 'column',
    },
    textField: {
      width: '300px',
      margin: '10px 0',
    },
    loginButton: {
      margin: '10px 0',
    },
  })
);

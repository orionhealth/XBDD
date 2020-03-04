import { createStyles, makeStyles, Theme, StyleRules } from '@material-ui/core';

export const useNavbarStyles = makeStyles(() =>
  createStyles({
    logoFlex: {
      color: 'inherit',
      flexGrow: 1,
      textAlign: 'left',
    },
    logo: {
      fontSize: '20px',
      padding: '0px',
      color: 'inherit',
    },
    login: {
      display: 'contents',
      flexGrow: 1,
      textAlign: 'right',
    },
    loginButton: {
      marginRight: '8px',
    },
  })
);

export const loginDialogStyles = (theme: Theme): StyleRules =>
  createStyles({
    textField: {
      display: 'block',
    },
    input: {
      color: theme.palette.primary.main,
    },
  });

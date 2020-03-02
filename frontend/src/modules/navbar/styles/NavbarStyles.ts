import { createStyles, Theme } from '@material-ui/core';
import { StyleRules } from '@material-ui/core/styles/withStyles';

const navbarStyles = (theme: Theme): StyleRules =>
  createStyles({
    xbddLogoFlex: {
      color: 'inherit',
      flexGrow: 1,
      textAlign: 'left',
    },
    xbddLogo: {
      fontSize: '20px',
      padding: '0px',
      color: 'inherit',
    },
    xbddLogin: {
      display: 'contents',
      flexGrow: 1,
      marginRight: '5px',
      textAlign: 'right',
    },
    loginInput: {
      color: theme.palette.secondary.main,
    },
  });

export default navbarStyles;

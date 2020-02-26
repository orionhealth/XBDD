import { createStyles } from '@material-ui/core';

const navbarStyles = theme =>
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

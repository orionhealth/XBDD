import { createStyles, fade } from '@material-ui/core';

const navbarStyles = theme =>
  createStyles({
    appBarBorder: {
      borderRadius: '10px 10px 0 0',
    },
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

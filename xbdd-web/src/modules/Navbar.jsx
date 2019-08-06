import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import navbarStyles from './navbar/styles/NavbarStyles';

const theme = createMuiTheme({
  palette: {
    primary: { main: '#457B9D' },
  },
  typography: {
    useNextVariants: true,
  },
});

const Navbar = (props) => {
  const { classes } = props;

  return (
    <MuiThemeProvider theme={theme}>
      <div className={classes.xbddNavbarStyles}>
        <AppBar position="static" className={classes.appBarBorder}>
          <Toolbar>
            <div className={classes.xbddLogoFlex}>
              <a href="/" className={classes.xbddLogo}>
                <Typography variant="h5" color="inherit">
                  xbdd
                </Typography>
              </a>
            </div>
            <div className={classes.xbddLogin}>
              <Button color="inherit">Login</Button>
            </div>
          </Toolbar>
        </AppBar>
      </div>
    </MuiThemeProvider>
  );
};

Navbar.propTypes = {
  classes: PropTypes.shape({}),
  styles: PropTypes.shape({}),
};

export default withStyles(navbarStyles)(Navbar);

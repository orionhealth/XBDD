import React from "react";
import PropTypes from "prop-types";
import { withStyles, MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { AppBar, Toolbar, Button, TextField, Avatar, Box } from "@material-ui/core";
import navbarStyles from "./styles/NavbarStyles";

const theme = createMuiTheme({
  palette: {
    primary: { main: "#457B9D" },
  },
  typography: {
    useNextVariants: true,
  },
});

const Navbar = props => {
  const { userName, userNameInput, handleUserNameInput, login, classes } = props;

  return (
    <MuiThemeProvider theme={theme}>
      <AppBar position="static" className={classes.appBarBorder}>
        <Toolbar>
          <Box className={classes.xbddLogoFlex}>
            <Box>
              <Button href="/" className={classes.xbddLogo}>
                XBDD
              </Button>
            </Box>
          </Box>
          <Box className={classes.xbddLogin}>
            <TextField
              label="User Name"
              margin="dense"
              variant="outlined"
              value={userNameInput ? userNameInput : ""}
              onChange={handleUserNameInput}
              InputProps={{ style: { color: "white" } }}
            />
            <Button color="inherit" onClick={login}>
              Login
            </Button>
            <Avatar>{userName}</Avatar>
          </Box>
        </Toolbar>
      </AppBar>
    </MuiThemeProvider>
  );
};

Navbar.propTypes = {
  userName: PropTypes.string,
  userNameInput: PropTypes.string,
  handleUserNameInput: PropTypes.func,
  login: PropTypes.func,
  classes: PropTypes.shape({}),
  styles: PropTypes.shape({}),
};

export default withStyles(navbarStyles)(Navbar);

import React, { useState } from "react";
import PropTypes from "prop-types";
import { withStyles, MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { AppBar, Toolbar, Button, TextField, Avatar, Box } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";

import navbarStyles from "./styles/NavbarStyles";
import { setUser } from "../../xbddReducer";

const theme = createMuiTheme({
  palette: {
    primary: { main: "#457B9D" },
  },
  typography: {
    useNextVariants: true,
  },
});

const Navbar = props => {
  const { classes } = props;
  const [loginInput, setLoginInput] = useState("");
  const loggedInUser = useSelector(state => state.app.user);

  const dispatch = useDispatch();
  const login = () => dispatch(setUser(loginInput)) && setLoginInput("");
  const logout = () => dispatch(setUser(null));

  return (
    <MuiThemeProvider theme={theme}>
      <AppBar position="static" className={classes.appBarBorder}>
        <Toolbar>
          <Box className={classes.xbddLogoFlex}>
            <Button href="/" className={classes.xbddLogo}>
              XBDD
            </Button>
          </Box>
          <Box className={classes.xbddLogin}>
            {!loggedInUser && (
              <TextField
                label="User Name"
                margin="dense"
                variant="outlined"
                value={loginInput}
                onChange={event => setLoginInput(event.target.value)}
                InputProps={{ style: { color: "white" } }}
                autoFocus
                onKeyPress={e => e.key === "Enter" && login()}
              />
            )}
            <Button color="inherit" onClick={() => (loggedInUser ? logout() : login())}>
              {loggedInUser ? "Logout" : "Login"}
            </Button>
            <Avatar>{loggedInUser}</Avatar>
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

export default withStyles(navbarStyles)(React.memo(Navbar));

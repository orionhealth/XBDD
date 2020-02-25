import React, { useState, FC, ChangeEvent, KeyboardEvent } from 'react';
import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { AppBar, Toolbar, Button, TextField, Avatar, Box, Theme, WithStyles } from '@material-ui/core';
import { useDispatch, connect } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { RootStore } from 'rootReducer';
import navbarStyles from './styles/NavbarStyles';
import { setUser } from '../../xbddReducer';

const theme: Theme = createMuiTheme({
  palette: {
    primary: { main: '#457B9D' },
  },
});

interface StateProps {
  loggedInUser: string | null;
}

type Props = WithStyles<typeof navbarStyles> & StateProps;

const Navbar: FC<Props> = props => {
  const { classes, loggedInUser } = props;
  const { t } = useTranslation();

  const [loginInput, setLoginInput] = useState('');

  const dispatch = useDispatch();
  const login = (): void => dispatch(setUser(loginInput)) && setLoginInput('');
  const logout = (): void => {
    dispatch(setUser(null));
  };

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
                label={t('navbar.userName')}
                margin="dense"
                variant="outlined"
                value={loginInput}
                onChange={(event: ChangeEvent<HTMLInputElement>): void => setLoginInput(event.target.value)}
                InputProps={{ style: { color: 'white' } }}
                onKeyPress={(event: KeyboardEvent<HTMLDivElement>): void => {
                  event.key === 'Enter' && login();
                }}
              />
            )}
            <Button color="inherit" onClick={(): void => (loggedInUser ? logout() : login())}>
              {loggedInUser ? t('navbar.logout') : t('navbar.login')}
            </Button>
            <Avatar>{loggedInUser}</Avatar>
          </Box>
        </Toolbar>
      </AppBar>
    </MuiThemeProvider>
  );
};

const mapStateToProps = (state: RootStore): StateProps => ({
  loggedInUser: state.app.user,
});

export default connect(mapStateToProps)(withStyles(navbarStyles)(React.memo(Navbar)));

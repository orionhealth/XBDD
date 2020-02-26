import React, { useState, FC, ChangeEvent, KeyboardEvent } from 'react';
import { withStyles, ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { AppBar, Toolbar, Button, TextField, Avatar, Box, WithStyles, fade } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { RootStore } from 'rootReducer';
import navbarStyles from './styles/NavbarStyles';
import { setUser } from '../../xbddReducer';

type Props = WithStyles<typeof navbarStyles>;

const Navbar: FC<Props> = props => {
  const { classes } = props;
  const { t } = useTranslation();

  const [loginInput, setLoginInput] = useState('');
  const loggedInUser = useSelector((state: RootStore) => state.app.user);

  const dispatch = useDispatch();
  const login = (): void => dispatch(setUser(loginInput)) && setLoginInput('');
  const logout = (): void => {
    dispatch(setUser(null));
  };

  return (
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
              color="secondary"
              InputLabelProps={{ className: classes.loginInput }}
              InputProps={{ className: classes.loginInput }}
              label={t('navbar.userName')}
              margin="dense"
              onChange={(event: ChangeEvent<HTMLInputElement>): void => setLoginInput(event.target.value)}
              onKeyPress={(event: KeyboardEvent<HTMLDivElement>): void => {
                event.key === 'Enter' && login();
              }}
              value={loginInput}
              variant="outlined"
            />
          )}
          <Button color="inherit" onClick={(): void => (loggedInUser ? logout() : login())}>
            {loggedInUser ? t('navbar.logout') : t('navbar.login')}
          </Button>
          <Avatar>{loggedInUser}</Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default withStyles(navbarStyles)(React.memo(Navbar));

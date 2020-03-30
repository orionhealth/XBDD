import React, { useState, FC } from 'react';
import { AppBar, Toolbar, Button, Avatar, Box } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { RootStore } from 'rootReducer';
import { setUser, selectProductBuildAndVersion } from '../../xbddReducer';
import LoginDialog from './LoginDialog';
import { useNavbarStyles } from './styles/NavbarStyles';

const Navbar: FC = () => {
  const { t } = useTranslation();
  const classes = useNavbarStyles();

  const [openDialog, setOpenDialog] = useState(false);
  const loggedInUser = useSelector((state: RootStore) => state.app.user);

  const dispatch = useDispatch();
  const history = useHistory();

  const onLogin = (user: string, password: string, remember: boolean): void => {
    dispatch(setUser({ user, remember }));
    setOpenDialog(false);
  };

  const onLogout = (): void => {
    dispatch(setUser(null));
    history.push('/');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Box className={classes.logoFlex}>
          <Button
            className={classes.logo}
            onClick={(): void => {
              dispatch(selectProductBuildAndVersion(null));
              history.push('/');
            }}
          >
            {'XBDD'}
          </Button>
        </Box>
        <Box className={classes.login}>
          <Button
            className={classes.loginButton}
            color="secondary"
            onClick={(): void => {
              loggedInUser ? onLogout() : setOpenDialog(true);
            }}
          >
            {loggedInUser ? t('navbar.logout') : t('navbar.login')}
          </Button>
          <Avatar>{loggedInUser}</Avatar>
        </Box>
      </Toolbar>
      <LoginDialog open={openDialog} onLogin={onLogin} onCancel={(): void => setOpenDialog(false)} />
    </AppBar>
  );
};

export default React.memo(Navbar);

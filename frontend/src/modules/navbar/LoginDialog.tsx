import React, { FC, ChangeEvent, KeyboardEvent, useState } from 'react';
import { Dialog, DialogContent, DialogActions, TextField, Button } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import { useLoginDialogStyles } from './styles/NavbarStyles';

interface Props {
  open: boolean;
  onLogin(user: string, password: string): void;
  onCancel(): void;
}

const LoginDialog: FC<Props> = ({ open, onLogin, onCancel }) => {
  const { t } = useTranslation();
  const classes = useLoginDialogStyles();

  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');

  const login = (): void => {
    onLogin(user, password);
    setUser('');
    setPassword('');
  };

  const cancel = (): void => {
    onCancel();
    setUser('');
    setPassword('');
  };

  return (
    <Dialog open={open}>
      <DialogContent>
        <TextField
          className={classes.textField}
          InputLabelProps={{ className: classes.input }}
          label={t('navbar.userName')}
          margin="dense"
          onChange={(event: ChangeEvent<HTMLInputElement>): void => setUser(event.target.value)}
          onKeyPress={(event: KeyboardEvent<HTMLDivElement>): void => {
            event.key === 'Enter' && login();
          }}
          value={user}
          variant="outlined"
        />
        <TextField
          className={classes.textField}
          InputLabelProps={{ className: classes.input }}
          label={t('navbar.password')}
          margin="dense"
          onChange={(event: ChangeEvent<HTMLInputElement>): void => setPassword(event.target.value)}
          onKeyPress={(event: KeyboardEvent<HTMLDivElement>): void => {
            event.key === 'Enter' && login();
          }}
          type="password"
          value={password}
          variant="outlined"
        />
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={cancel}>
          {t('navbar.cancel')}
        </Button>
        <Button color="primary" onClick={login}>
          {t('navbar.login')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LoginDialog;

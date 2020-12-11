import React, { FC, ReactNode } from 'react';
import { Dialog, DialogTitle, DialogContent, Button, DialogActions, TextField } from '@material-ui/core';
import { GitHub, Android } from '@material-ui/icons';
import { useTranslation } from 'react-i18next';

import { useLoginDialogStyles } from './styles/LoginDialogStyles';

interface Props {
  open: boolean;
  onClose(): void;
}

const UsernamePasswordForm: FC = () => {
  const classes = useLoginDialogStyles();
  const { t } = useTranslation();

  return (
    <form className={classes.columnDisplay} method="post" action={`${process.env.REACT_APP_BACKEND_HOST}/login`}>
      <TextField label="Username" name="username" variant="outlined" required className={classes.textField} />
      <TextField label="Password" name="password" variant="outlined" type="password" required className={classes.textField} />
      <Button className={classes.loginButton} variant="contained" type="submit">
        {t('navbar.signIn')}
      </Button>
    </form>
  );
};

interface OAuthButtonProps {
  provider: string;
  icon: ReactNode;
  label: string;
}

const OAuthButton: FC<OAuthButtonProps> = ({ provider, icon, label }) => {
  const classes = useLoginDialogStyles();
  return (
    <Button
      href={`${process.env.REACT_APP_BACKEND_HOST}/oauth2/authorization/${provider}`}
      variant="contained"
      className={classes.loginButton}
      startIcon={icon}
    >
      {label}
    </Button>
  );
};

const LoginDialog: FC<Props> = ({ open, onClose }) => {
  const classes = useLoginDialogStyles();
  const { t } = useTranslation();

  // TODO - add more buttons below and/or make dynamic based on registered providers.
  return (
    <Dialog open={open} onEscapeKeyDown={onClose} onBackdropClick={onClose}>
      <DialogTitle>{t('navbar.loginToXbdd')}</DialogTitle>
      <DialogContent className={classes.columnDisplay}>
        <UsernamePasswordForm />
        <OAuthButton provider="github" icon={<GitHub />} label={t('navbar.loginWithGithub')} />
        <OAuthButton provider="google" icon={<Android />} label={t('navbar.loginWithGoogle')} />
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={onClose}>
          {t('navbar.cancel')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LoginDialog;

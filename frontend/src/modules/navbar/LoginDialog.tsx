import React, { FC, ReactNode } from 'react';
import { Dialog, DialogTitle, DialogContent, Button, DialogActions, makeStyles } from '@material-ui/core';
import { GitHub, Android } from '@material-ui/icons';
import { useTranslation } from 'react-i18next';

interface Props {
  open: boolean;
  onClose(): void;
}

const useStyles = makeStyles({
  loginButtons: {
    display: 'flex',
    flexDirection: 'column',
  },

  loginButton: {
    marginBottom: '20px',
  },

  usernamePasswordLabel: {
    width: '100px',
    display: 'inline-block',
  },
});

const UsernamePasswordForm: FC = () => {
  const styles = useStyles();
  return (
    <form className="form-signin" method="post" action={`${process.env.REACT_APP_BACKEND_HOST}/login`}>
      <p>
        <label htmlFor="username" className={styles.usernamePasswordLabel}>
          Username
        </label>
        <input type="text" id="username" name="username" className="form-control" placeholder="Username" required />
      </p>
      <p>
        <label htmlFor="password" className={styles.usernamePasswordLabel}>
          Password
        </label>
        <input type="password" id="password" name="password" className="form-control" placeholder="Password" required />
      </p>
      <Button className={styles.loginButton} variant="contained" type="submit">
        Sign in
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
  const styles = useStyles();
  return (
    <Button
      href={`${process.env.REACT_APP_BACKEND_HOST}/oauth2/authorization/${provider}`}
      variant="contained"
      className={styles.loginButton}
      startIcon={icon}
    >
      {label}
    </Button>
  );
};

const LoginDialog: FC<Props> = ({ open, onClose }) => {
  const styles = useStyles();
  const { t } = useTranslation();

  // TODO - add more buttons below and/or make dynamic based on registered providers.
  return (
    <Dialog open={open} onEscapeKeyDown={onClose} onBackdropClick={onClose}>
      <DialogTitle>{t('navbar.loginToXbdd')}</DialogTitle>
      <DialogContent className={styles.loginButtons}>
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

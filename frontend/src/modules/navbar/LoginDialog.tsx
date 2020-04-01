import React, { FC } from 'react';
import { Dialog, WithStyles, DialogTitle, DialogContent, Button, DialogActions } from '@material-ui/core';
import { GitHub } from '@material-ui/icons';
import { useTranslation } from 'react-i18next';

interface Props extends WithStyles {
  open: boolean;
  onClose(): void;
}

const LoginDialog: FC<Props> = ({ open, onClose }) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onEscapeKeyDown={onClose} onBackdropClick={onClose}>
      <DialogTitle>{t('navbar.loginToXbdd')}</DialogTitle>
      <DialogContent>
        <Button
          href={`https://github.com/login/oauth/authorize?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}`}
          variant="contained"
          startIcon={<GitHub />}
        >
          {t('navbar.loginWithGithub')}
        </Button>
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

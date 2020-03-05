import React, { Component, ChangeEvent, FormEvent, ReactNode } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormGroup,
  FormControlLabel,
  withStyles,
  WithStyles,
} from '@material-ui/core';
import CheckBox from '@material-ui/core/Checkbox';
import { withTranslation, WithTranslation } from 'react-i18next';

import { loginDialogStyles } from './styles/NavbarStyles';

interface Props extends WithStyles, WithTranslation {
  open: boolean;
  onLogin(user: string, password: string, remember: boolean): void;
  onCancel(): void;
}

interface State {
  user: string;
  password: string;
  remember: boolean;
}

const initialState = {
  user: '',
  password: '',
  remember: false,
};

class LoginDialog extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  clearState(): void {
    this.setState(initialState);
  }

  login = (event: FormEvent): void => {
    const { onLogin } = this.props;
    const { user, password, remember } = this.state;
    event.preventDefault();
    onLogin(user, password, remember);
    this.clearState();
  };

  cancel = (): void => {
    const { onCancel } = this.props;
    onCancel();
    this.clearState();
  };

  render(): ReactNode {
    const { open, classes, t } = this.props;
    const { user, password, remember } = this.state;

    return (
      <Dialog open={open} onEscapeKeyDown={this.cancel} onBackdropClick={this.cancel}>
        <form onSubmit={this.login}>
          <DialogContent>
            <FormGroup>
              <TextField
                className={classes.textField}
                label={t('navbar.user')}
                margin="dense"
                onChange={(event: ChangeEvent<HTMLInputElement>): void => this.setState({ user: event.target.value })}
                value={user}
                variant="outlined"
              />
              <TextField
                className={classes.textField}
                label={t('navbar.password')}
                margin="dense"
                onChange={(event: ChangeEvent<HTMLInputElement>): void => this.setState({ password: event.target.value })}
                type="password"
                value={password}
                variant="outlined"
              />
              <FormControlLabel
                control={
                  <CheckBox
                    color="primary"
                    checked={remember}
                    onChange={(event: ChangeEvent<HTMLInputElement>): void => this.setState({ remember: event.target.checked })}
                  />
                }
                label={t('navbar.rememberMe')}
              />
            </FormGroup>
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={this.cancel}>
              {t('navbar.cancel')}
            </Button>
            <Button color="primary" type="submit">
              {t('navbar.login')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    );
  }
}

export default withTranslation()(withStyles(loginDialogStyles)(LoginDialog));

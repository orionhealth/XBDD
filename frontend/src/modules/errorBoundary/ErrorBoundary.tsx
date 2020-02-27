import React, { ReactNode } from 'react';
import { Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import { withTranslation, WithTranslation } from 'react-i18next';

interface State {
  error: Error | null;
}

type Props = WithTranslation;

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: object): void {
    console.error(error, errorInfo);
  }

  render(): ReactNode {
    const { t } = this.props;
    const { error } = this.state;
    if (error) {
      return (
        <Snackbar
          open
          onClose={(): void => {
            this.setState({ error: null });
          }}
        >
          <MuiAlert elevation={6} variant="filled" severity="error">
            {t('errors.unexpected')}
          </MuiAlert>
        </Snackbar>
      );
    }

    return this.props.children;
  }
}

export default withTranslation()(ErrorBoundary);

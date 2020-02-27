import React, { ReactNode } from 'react';
import { Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';

interface State {
  error: Error | null;
}

class ErrorBoundary extends React.Component<{}, State> {
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
    const { error } = this.state;
    if (error) {
      return (
        <Snackbar open autoHideDuration={6000}>
          <MuiAlert elevation={6} variant="filled" severity="error">
            {error.message}
          </MuiAlert>
        </Snackbar>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

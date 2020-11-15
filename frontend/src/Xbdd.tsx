import React, { Suspense, FC } from 'react';
import { ThemeProvider } from '@material-ui/core';

import ErrorBoundary from 'modules/errorBoundary/ErrorBoundary';
import theme from 'AppTheme';
import XbddRouter from 'XbddRouter';

import './Xbdd.css';

const Xbdd: FC = () => {
  return (
    <div className="xbdd-app">
      <Suspense fallback={<div />}>
        <ThemeProvider theme={theme}>
          <ErrorBoundary>
            <XbddRouter />
          </ErrorBoundary>
        </ThemeProvider>
      </Suspense>
    </div>
  );
};

export default Xbdd;

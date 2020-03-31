import React, { Suspense, FC } from 'react';
import { useSelector } from 'react-redux';
import { ThemeProvider } from '@material-ui/core';
import { BrowserRouter as Router, Switch, Route, useParams } from 'react-router-dom';

import Navbar from 'modules/navbar/Navbar';
import SummaryContainer from 'modules/summary/SummaryContainer';
import ReportContainer from 'modules/report/ReportContainer';
import ErrorBoundary from 'modules/errorBoundary/ErrorBoundary';
import theme from 'AppTheme';
import NotificationsView from 'modules/notifications/NotificationsView';

import './Xbdd.css';

import { RootStore } from 'rootReducer';

const ReportPage: FC<{}> = () => {
  const { product, version, build } = useParams();
  return <ReportContainer product={product} version={version} build={build} />;
};

const PageContent: FC<{}> = () => {
  const user = useSelector((state: RootStore) => state.app.user);
  if (!user) {
    return <div />;
  }
  return (
    <Switch>
      <Route path="/reports/:product/:version/:build">
        <ReportPage />
      </Route>
      <Route path="/">
        <SummaryContainer />
      </Route>
    </Switch>
  );
};

const Xbdd: FC<{}> = () => {
  return (
    <div className="xbdd-app">
      <Suspense fallback={<div />}>
        <ThemeProvider theme={theme}>
          <ErrorBoundary>
            <Router>
              <Navbar />
              <PageContent />
              <NotificationsView />
            </Router>
          </ErrorBoundary>
        </ThemeProvider>
      </Suspense>
    </div>
  );
};

export default Xbdd;

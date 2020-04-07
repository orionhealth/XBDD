import React, { Suspense, FC } from 'react';
import { ThemeProvider } from '@material-ui/core';
import { BrowserRouter as Router, Switch, Route, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Navbar from 'modules/navbar/Navbar';
import SummaryContainer from 'modules/summary/SummaryContainer';
import ReportContainer from 'modules/report/ReportContainer';
import ErrorBoundary from 'modules/errorBoundary/ErrorBoundary';
import theme from 'AppTheme';
import NotificationsView from 'modules/notifications/NotificationsView';
import RedirectPage from 'modules/redirect/RedirectPage';
import { RootStore } from 'rootReducer';

import './Xbdd.css';

const ReportPage: FC = () => {
  const { product, version, build } = useParams();
  return <ReportContainer product={product} version={version} build={build} />;
};

const PageContent: FC = () => {
  const loggedIn = useSelector((store: RootStore) => Boolean(store.app.user));
  return (
    <Switch>
      <Route path="/redirect">
        <RedirectPage />
      </Route>
      <Route path="/reports/:product/:version/:build">{loggedIn && <ReportPage />}</Route>
      <Route path="/">{loggedIn && <SummaryContainer />}</Route>
    </Switch>
  );
};

const Xbdd: FC = () => {
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

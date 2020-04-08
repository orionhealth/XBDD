import React, { Suspense, FC } from 'react';
import { ThemeProvider } from '@material-ui/core';
import { BrowserRouter as Router, Switch, Route, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import Navbar from 'modules/navbar/Navbar';
import SummaryContainer from 'modules/summary/SummaryContainer';
import ReportContainer from 'modules/report/ReportContainer';
import ErrorBoundary from 'modules/errorBoundary/ErrorBoundary';
import theme from 'AppTheme';
import NotificationsView from 'modules/notifications/NotificationsView';
import RedirectPage from 'modules/redirect/RedirectPage';
import { RootStore } from 'rootReducer';
import { getUserIfTokenIsValid } from 'xbddReducer';
import { User } from 'models/User';

import './Xbdd.css';

interface UserProps {
  user: User | null;
}

const ReportPage: FC<UserProps> = ({ user }) => {
  const { product, version, build } = useParams();
  return <ReportContainer user={user} product={product} version={version} build={build} />;
};

const PageContent: FC<UserProps> = ({ user }) => {
  return (
    <Switch>
      <Route path="/redirect">
        <RedirectPage />
      </Route>
      <Route path="/reports/:product/:version/:build">
        <ReportPage user={user} />
      </Route>
      <Route path="/">
        <SummaryContainer user={user} />
      </Route>
    </Switch>
  );
};

const Xbdd: FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((store: RootStore) => store.app.user);

  if (!user) {
    dispatch(getUserIfTokenIsValid());
  }

  return (
    <div className="xbdd-app">
      <Suspense fallback={<div />}>
        <ThemeProvider theme={theme}>
          <ErrorBoundary>
            <Router>
              <Navbar />
              <PageContent user={user} />
              <NotificationsView />
            </Router>
          </ErrorBoundary>
        </ThemeProvider>
      </Suspense>
    </div>
  );
};

export default Xbdd;

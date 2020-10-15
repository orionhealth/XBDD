import React, { FC } from 'react';
import { BrowserRouter as Router, Switch, Route, useParams } from 'react-router-dom';
import { connect, useSelector, useDispatch } from 'react-redux';

import Navbar from 'modules/navbar/Navbar';
import SummaryContainer from 'modules/summary/SummaryContainer';
import ReportContainer from 'modules/report/ReportContainer';
import NotificationsView from 'modules/notifications/NotificationsView';
import { RootStore } from 'rootReducer';
import { fetchUser } from 'redux/UserReducer';
import { LoggedInUser } from 'models/User';
import { updateReportIdentifier } from 'redux/ReportReducer';
import { fetchIndexes } from 'redux/FeatureReducer';
import { fetchTagsMetadata } from 'redux/TagsMetadataReducer';

interface UserProps {
  user: LoggedInUser;
}

interface DispatchProps {
  fetchIndexes(): void;
  fetchTagsMetadata(): void;
}

type Props = UserProps & DispatchProps;

interface reportIdentifier {
  product: string;
  version: string;
  build: string;
}

const ReportPage: FC<Props> = ({ user, fetchIndexes, fetchTagsMetadata }) => {
  const dispatch = useDispatch();
  const { product, version, build } = useParams<reportIdentifier>();
  dispatch(updateReportIdentifier(product, version, build));
  dispatch(fetchIndexes());
  dispatch(fetchTagsMetadata());
  return <ReportContainer user={user} />;
};

const XbddRouter: FC<DispatchProps> = ({ fetchIndexes, fetchTagsMetadata }) => {
  const dispatch = useDispatch();
  const user = useSelector((store: RootStore) => store.user);

  if (!user) {
    dispatch(fetchUser());
  }

  return (
    <Router>
      <Navbar />
      {user && (
        <Switch>
          <Route path="/reports/:product/:version/:build">
            <ReportPage user={user} fetchIndexes={fetchIndexes} fetchTagsMetadata={fetchTagsMetadata} />
          </Route>
          <Route path="/">
            <SummaryContainer user={user} />
          </Route>
        </Switch>
      )}
      <NotificationsView />
    </Router>
  );
};

const mapDispatch = { fetchIndexes, fetchTagsMetadata };

export default connect(null, mapDispatch)(XbddRouter);

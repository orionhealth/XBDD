import React, { FC } from 'react';
import { BrowserRouter as Router, Switch, Route, useParams } from 'react-router-dom';
import { connect, useSelector, useDispatch } from 'react-redux';

import Navbar from 'modules/navbar/Navbar';
import SummaryContainer from 'modules/summary/SummaryContainer';
import ReportContainer from 'modules/report/ReportContainer';
import NotificationsView from 'modules/notifications/NotificationsView';
import { StoreDispatch, RootStore } from 'rootReducer';
import { fetchUser } from 'redux/UserReducer';
import { LoggedInUser } from 'models/User';
import { updateReportIdentifier } from 'redux/ReportReducer';
import { fetchIndexes } from 'redux/FeatureReducer';
import { fetchTagsMetadata } from 'redux/TagsMetadataReducer';
import { bindActionCreators } from 'redux';

interface UserProps {
  user: LoggedInUser;
}

interface DispatchProps {
  dispatchFetchIndexes(): void;
  dispatchFetchTagsMetadata(): void;
}

type Props = UserProps & DispatchProps;

interface reportIdentifier {
  product: string;
  version: string;
  build: string;
}

const ReportPage: FC<Props> = ({ user, dispatchFetchIndexes, dispatchFetchTagsMetadata }) => {
  const dispatch = useDispatch();
  const { product, version, build } = useParams<reportIdentifier>();
  dispatch(updateReportIdentifier(product, version, build));
  dispatchFetchIndexes();
  dispatchFetchTagsMetadata();
  return <ReportContainer user={user} />;
};

const XbddRouter: FC<DispatchProps> = ({ dispatchFetchIndexes, dispatchFetchTagsMetadata }) => {
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
            <ReportPage user={user} dispatchFetchIndexes={dispatchFetchIndexes} dispatchFetchTagsMetadata={dispatchFetchTagsMetadata} />
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

const mapDispatchToProps = (dispatch: StoreDispatch): DispatchProps => ({
  dispatchFetchIndexes: bindActionCreators(fetchIndexes, dispatch),
  dispatchFetchTagsMetadata: bindActionCreators(fetchTagsMetadata, dispatch),
});

export default connect(null, mapDispatchToProps)(XbddRouter);

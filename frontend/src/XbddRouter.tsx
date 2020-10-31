import React, { FC } from 'react';
import { BrowserRouter as Router, Switch, Route, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import Navbar from 'modules/navbar/Navbar';
import SummaryContainer from 'modules/summary/SummaryContainer';
import ReportContainer from 'modules/report/ReportContainer';
import NotificationsView from 'modules/notifications/NotificationsView';
import { RootStore } from 'rootReducer';
import { fetchUser } from 'redux/UserReducer';
import { LoggedInUser } from 'models/User';
import { fetchProductList, updateReportIdentifier } from 'redux/ReportReducer';
import { fetchIndexes } from 'redux/FeatureReducer';
import { fetchTagsMetadata } from 'redux/TagsMetadataReducer';
import { getDecodedIdentifier } from 'lib/rest/URIHelper';

interface Props {
  user: LoggedInUser;
}

interface ReportIdentifier {
  productParam: string;
  versionParam: string;
  buildParam: string;
}

const ReportPage: FC<Props> = ({ user }) => {
  const dispatch = useDispatch();
  const { productParam, versionParam, buildParam } = useParams<ReportIdentifier>();
  const { product, version, build } = getDecodedIdentifier(productParam, versionParam, buildParam);
  dispatch(updateReportIdentifier(product, version, build));
  dispatch(fetchIndexes());
  dispatch(fetchTagsMetadata());
  dispatch(fetchProductList());
  return <ReportContainer user={user} />;
};

const SummaryPage: FC<Props> = ({ user }) => {
  const dispatch = useDispatch();
  dispatch(fetchProductList());
  return <SummaryContainer user={user} />;
};

const XbddRouter: FC = () => {
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
          <Route path="/reports/:productParam/:versionParam/:buildParam">
            <ReportPage user={user} />
          </Route>
          <Route path="/">
            <SummaryPage user={user} />
          </Route>
        </Switch>
      )}
      <NotificationsView />
    </Router>
  );
};

export default XbddRouter;

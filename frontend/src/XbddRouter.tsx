import React, { FC, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, useParams, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import Navbar from 'modules/navbar/Navbar';
import SummaryContainer from 'modules/summary/SummaryContainer';
import ReportContainer from 'modules/report/ReportContainer';
import NotificationsView from 'modules/notifications/NotificationsView';
import { RootStore } from 'rootReducer';
import { fetchUser } from 'redux/UserReducer';
import { User } from 'models/User';
import { fetchProductList, updateReportIdentifier } from 'redux/ReportReducer';
import { fetchIndexes, saveStatusFilter } from 'redux/FeatureReducer';
import { fetchTagsMetadata } from 'redux/TagsMetadataReducer';
import { getDecodedIdentifier } from 'lib/rest/URIHelper';
import { Passed, Failed, Skipped, Undefined } from 'models/Status';

interface Props {
  user: User;
}

interface ReportIdentifier {
  productParam: string;
  versionParam: string;
  buildParam: string;
}

const ReportPage: FC<Props> = ({ user }) => {
  const dispatch = useDispatch();
  const location = useLocation();

  const { productParam, versionParam, buildParam } = useParams<ReportIdentifier>();
  const { product, version, build } = getDecodedIdentifier(productParam, versionParam, buildParam);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const hiddenStatuses = searchParams.getAll('hidden');
    const selectedStatuses = {
      [Passed]: !hiddenStatuses.includes(Passed),
      [Failed]: !hiddenStatuses.includes(Failed),
      [Skipped]: !hiddenStatuses.includes(Skipped),
      [Undefined]: !hiddenStatuses.includes(Undefined),
    };
    dispatch(saveStatusFilter({ selectedStatuses }));
  }, [dispatch, location.search]);

  useEffect(() => {
    dispatch(updateReportIdentifier(product, version, build));

    dispatch(fetchIndexes());
    dispatch(fetchTagsMetadata());
    dispatch(fetchProductList());
  }, [dispatch, product, version, build]);

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

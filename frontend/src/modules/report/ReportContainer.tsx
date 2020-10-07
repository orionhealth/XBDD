import React, { FC, useEffect } from 'react';
import { Grid, Card } from '@material-ui/core';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';

import { reportContainerStyles } from './styles/ReportContainerStyles';
import FeatureListContainer from './FeatureListContainer/FeatureListContainer';
import ScenarioDisplay from './ScenarioDisplay/ScenarioDisplay';
import FeatureSummary from './FeatureSummary/FeatureSummary';
import { LoggedInUser } from 'models/User';
import { RootStore } from 'rootReducer';
import { updateReportIdentifier } from 'redux/ReportReducer';

interface Props extends WithStyles {
  user: LoggedInUser;
  productId: string;
  versionString: string;
  build: string;
}

const ReportContainer: FC<Props> = ({ user, productId, versionString, build, classes }) => {
  const selectedFeature = useSelector((state: RootStore) => state.feature.selected);
  const executionHistory = useSelector((state: RootStore) => state.feature.executionHistory);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(updateReportIdentifier(productId, versionString, build));
  });

  if (!user) {
    return null;
  }

  return (
    <>
      <Card elevation={0}>
        <Grid container>
          <Grid item xs={4} lg={4}>
            <FeatureListContainer
              user={user}
              productId={productId}
              versionString={versionString}
              build={build}
              selectedFeatureId={selectedFeature?._id}
            />
          </Grid>
          <Grid item xs={8} lg={8}>
            {selectedFeature && executionHistory && (
              <div className={classes.scenarioList}>
                <FeatureSummary feature={selectedFeature} executionHistory={executionHistory} />
                {selectedFeature.scenarios.map(scenario => (
                  <ScenarioDisplay key={scenario.id} scenario={scenario} build={build} />
                ))}
              </div>
            )}
          </Grid>
        </Grid>
      </Card>
    </>
  );
};

export default withStyles(reportContainerStyles)(ReportContainer);

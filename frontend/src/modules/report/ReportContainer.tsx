import React, { FC } from 'react';
import { Grid } from '@material-ui/core';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';

import { reportContainerStyles } from './styles/ReportContainerStyles';
import FeatureListContainer from './FeatureListContainer/FeatureListContainer';
import ScenarioDisplay from './ScenarioDisplay/ScenarioDisplay';
import FeatureSummary from './FeatureSummary/FeatureSummary';
import { LoggedInUser } from 'models/User';
import { RootStore } from 'rootReducer';

interface Props extends WithStyles {
  user: LoggedInUser;
}

const ReportContainer: FC<Props> = ({ user, classes }) => {
  const selectedFeature = useSelector((state: RootStore) => state.feature.selected);
  const executionHistory = useSelector((state: RootStore) => state.feature.executionHistory);

  if (!user) {
    return null;
  }

  return (
    <Grid container>
      <Grid item xs={4} lg={4}>
        <FeatureListContainer user={user} selectedFeatureId={selectedFeature?._id} />
      </Grid>
      <Grid item xs={8} lg={8}>
        {selectedFeature && executionHistory && (
          <div className={classes.scenarioList}>
            <FeatureSummary feature={selectedFeature} executionHistory={executionHistory} />
            {selectedFeature.scenarios.map(scenario => (
              <ScenarioDisplay key={scenario.id} scenario={scenario} />
            ))}
          </div>
        )}
      </Grid>
    </Grid>
  );
};

export default withStyles(reportContainerStyles)(ReportContainer);

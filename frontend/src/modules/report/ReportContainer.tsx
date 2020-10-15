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

interface Props extends WithStyles {
  user: LoggedInUser;
}

const ReportContainer: FC<Props> = ({ user, classes }) => {
  const selectedFeature = useSelector((state: RootStore) => state.feature.selected);
  const executionHistory = useSelector((state: RootStore) => state.feature.executionHistory);

  // === will remove this after the refactor is done ===
  const report = useSelector((state: RootStore) => state.report);
  const { product, version, build } = report;
  // ===================================================

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
              productId={product}
              versionString={version}
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

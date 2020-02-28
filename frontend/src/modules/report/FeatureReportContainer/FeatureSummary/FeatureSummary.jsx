import React from 'react';
import PropTypes from 'prop-types';
import { Card, Grid, Typography, Chip, Divider } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import { featureSummaryStyles } from './styles/FeatureSummaryStyles';
import ExecutionHistory from './ExecutionHistory';
import StatusIcons from './StatusIcons';

const renderTags = (tags, classes) => tags.map(tag => <Chip key={tag.name} label={tag.name} size="small" className={classes} />);

const renderLastEdit = classes => (
  <div className={classes}>
    <div>Last edited by: Feier</div>
    <div>3 minutes ago</div>
  </div>
);

const FeatureSummary = props => {
  const { feature, executionHistory, classes } = props;

  const classesMap = {
    passed: classes.xbddFeaturePassed,
    failed: classes.xbddFeatureFailed,
    undefined: classes.xbddFeatureUndefined,
    skipped: classes.xbddFeatureSkipped,
  };

  return (
    <Card raised className={classes.featureSummary}>
      <Grid container>
        <Grid item xs={3}>
          <StatusIcons firstStatus={feature.originalAutomatedStatus} secondStatus={feature.calculatedStatus} />
          {renderLastEdit(classes.featureEditInfo)}
          {feature.tags ? <div className={classes.featureTags}>{renderTags(feature.tags, classes.featureTag)}</div> : null}
        </Grid>
        <Grid item xs={9}>
          <Grid item xs={9}>
            <Typography variant="h6" className={`${classesMap[feature.calculatedStatus]} ${classes.featureTitle}`}>
              {feature.name}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography display="block" className={classes.featureDescription}>
              {feature.description}
            </Typography>
          </Grid>
          <Divider />
          <Grid item xs={9}>
            {executionHistory ? <ExecutionHistory executionHistory={executionHistory} /> : null}
          </Grid>
        </Grid>
      </Grid>
    </Card>
  );
};

FeatureSummary.propTypes = {
  feature: PropTypes.shape({}),
  executionHistory: PropTypes.arrayOf(PropTypes.shape({})),
  classes: PropTypes.shape({}),
};

export default withStyles(featureSummaryStyles)(FeatureSummary);

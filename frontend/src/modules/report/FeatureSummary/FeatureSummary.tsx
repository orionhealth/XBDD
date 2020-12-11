import React, { FC } from 'react';
import { Card, Grid, Typography, Chip } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import { useFeatureSummaryStyles } from './styles/FeatureSummaryStyles';
import ExecutionHistory from './ExecutionHistory';
import StatusIcons from './StatusIcons';
import Execution from 'models/Execution';
import Feature from 'models/Feature';
import { useStatusColorStyles } from 'modules/styles/globalStyles';

interface Props {
  feature: Feature;
  executionHistory: Execution[];
}

const FeatureSummary: FC<Props> = ({ feature, executionHistory }) => {
  const { t } = useTranslation();
  const classes = useFeatureSummaryStyles();

  const classesMap = useStatusColorStyles();

  return (
    <Card raised className={classes.featureSummary}>
      <Grid container>
        <Grid item xs={3}>
          <StatusIcons firstStatus={feature.originalAutomatedStatus} secondStatus={feature.calculatedStatus} />
          <div className={classes.featureEditInfo}>
            {feature.lastEditedBy && <div>{t('report.lastEditedBy', { name: feature.lastEditedBy })}</div>}
            {feature.lastEditedOn && <div>{t('report.lastEditedOn', { date: new Date(feature.lastEditedOn) })}</div>}
          </div>
          {feature.tags ? (
            <div className={classes.featureTags}>
              {feature.tags.map(tag => (
                <Chip key={tag.name} label={tag.name} size="small" className={classes.featureTag} />
              ))}
            </div>
          ) : null}
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
          <Grid item xs={9}>
            {executionHistory ? <ExecutionHistory executionHistory={executionHistory} /> : null}
          </Grid>
        </Grid>
      </Grid>
    </Card>
  );
};

export default FeatureSummary;

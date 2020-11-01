import React, { FC, ReactNode, useState } from 'react';
import { ExpansionPanel, ExpansionPanelSummary, Box, Typography, ExpansionPanelDetails, Grid, Button } from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import Scenario from 'models/Scenario';
import Status, { Passed, Skipped } from 'models/Status';
import { useScenarioDisplayStyles } from './styles/ScenarioDisplayStyles';
import StatusIcons from '../FeatureSummary/StatusIcons';
import ScenarioSteps from './components/ScenarioSteps';
import ScenarioInputField from './components/ScenarioInputField';
import { updateScenarioStatusWithRollback } from 'redux/FeatureReducer';
import { useStatusColorStyles } from 'modules/styles/globalStyles';

interface StepChange {
  stepId: number;
  status: Status;
}

interface Props {
  scenario: Scenario;
}

const ScenarioDisplay: FC<Props> = ({ scenario }) => {
  const [expanded, setExpanded] = useState(false);
  const dispatch = useDispatch();
  const classes = useScenarioDisplayStyles();
  const { t } = useTranslation();

  const classesMap = useStatusColorStyles();

  const { id, calculatedStatus, originalAutomatedStatus, steps, backgroundSteps, environmentNotes, testingTips, executionNotes } = scenario;

  let className = calculatedStatus ? classesMap[calculatedStatus] : classesMap[originalAutomatedStatus];

  if (expanded) {
    className += ` ${classes.expandedScenarioTitle}`;
  }

  const buttonClasses = (statusClass: string): string => `${classes.buttonForAllSteps} ${statusClass}`;

  const renderButton = (status: Status, classes: string, text: string): ReactNode => (
    <Button
      variant="contained"
      size="small"
      onClick={(): void => {
        dispatch(updateScenarioStatusWithRollback(scenario.id, status));
      }}
      className={classes}
    >
      {text}
    </Button>
  );

  return (
    <ExpansionPanel key={id} expanded={expanded} className={classes.scenarioListItem} TransitionProps={{ unmountOnExit: true }}>
      <ExpansionPanelSummary expandIcon={<ExpandMore />} onClick={(): void => setExpanded(!expanded)}>
        <Box display="flex" alignItems="center">
          <Box p={1} className={classes.statusIconsBox}>
            <StatusIcons
              firstStatus={scenario.originalAutomatedStatus}
              secondStatus={scenario.calculatedStatus ? scenario.calculatedStatus : scenario.originalAutomatedStatus}
              size="small"
            />
          </Box>
          <Box p={1} className={classes.scenarioTitleBox}>
            <Typography className={className}>{scenario.name}</Typography>
          </Box>
        </Box>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <Grid container>
          <Grid item xs={11}>
            {backgroundSteps && <ScenarioSteps title={t('report.backgroundSteps')} steps={backgroundSteps} scenarioId={scenario.id} />}
          </Grid>
          <Grid item xs={11}>
            {steps && <ScenarioSteps title={t('report.steps')} steps={steps} scenarioId={scenario.id} />}
          </Grid>
          <Grid item xs={5}>
            <ScenarioInputField scenarioId={scenario.id} label={t('report.environment')} content={environmentNotes} />
          </Grid>
          <Grid item xs={1} />
          <Grid item xs={5}>
            <ScenarioInputField scenarioId={scenario.id} label={t('report.executionNotes')} content={executionNotes} />
          </Grid>
          <Grid item xs={11}>
            <ScenarioInputField scenarioId={scenario.id} label={t('report.testingTips')} content={testingTips} />
          </Grid>
          <Grid item xs={11}>
            <div className={classes.buttons}>
              {renderButton(Skipped, buttonClasses(classes.skipAllSteps), t('report.skipAllSteps'))}
              {renderButton(Passed, buttonClasses(classes.passAllSteps), t('report.passAllSteps'))}
            </div>
          </Grid>
        </Grid>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
};

export default ScenarioDisplay;

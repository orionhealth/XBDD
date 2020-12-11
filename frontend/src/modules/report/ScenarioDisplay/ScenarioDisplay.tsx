import React, { FC, useState } from 'react';
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

interface Props {
  scenario: Scenario;
}

interface ActionButtonProps {
  scenarioId: string;
  status: Status;
  statusClass: string;
  text: string;
}

const ActionButton: FC<ActionButtonProps> = ({ scenarioId, status, statusClass, text }) => {
  const dispatch = useDispatch();
  const classes = useScenarioDisplayStyles();

  const buttonClasses = `${classes.buttonForAllSteps} ${statusClass}`;

  return (
    <Button
      variant="contained"
      size="small"
      onClick={(): void => {
        dispatch(updateScenarioStatusWithRollback(scenarioId, status));
      }}
      className={buttonClasses}
    >
      {text}
    </Button>
  );
};

const ScenarioDisplay: FC<Props> = ({ scenario }) => {
  const [expanded, setExpanded] = useState(false);
  const classes = useScenarioDisplayStyles();
  const { t } = useTranslation();

  const classesMap = useStatusColorStyles();

  const { id, calculatedStatus, originalAutomatedStatus, steps, backgroundSteps, environmentNotes, testingTips, executionNotes } = scenario;

  let className = calculatedStatus ? classesMap[calculatedStatus] : classesMap[originalAutomatedStatus];

  if (expanded) {
    className += ` ${classes.expandedScenarioTitle}`;
  }

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
            {backgroundSteps && <ScenarioSteps scenarioId={scenario.id} title={t('report.backgroundSteps')} steps={backgroundSteps} />}
          </Grid>
          <Grid item xs={11}>
            {steps && <ScenarioSteps scenarioId={scenario.id} title={t('report.steps')} steps={steps} />}
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
              <ActionButton scenarioId={scenario.id} status={Skipped} statusClass={classes.skipAllSteps} text={t('report.skipAllSteps')} />
              <ActionButton scenarioId={scenario.id} status={Passed} statusClass={classes.passAllSteps} text={t('report.passAllSteps')} />
            </div>
          </Grid>
        </Grid>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
};

export default ScenarioDisplay;

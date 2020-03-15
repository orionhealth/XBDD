import React, { FC, useState } from 'react';
import { ExpansionPanel, ExpansionPanelSummary, Box, Typography, ExpansionPanelDetails, Grid, Button } from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import { useTranslation } from 'react-i18next';

import Scenario from 'models/Scenario';
import Status, { Passed, Failed, Skipped, Undefined, StatusMap } from 'models/Status';
import useScenarioDisplayStyles from './styles/ScenarioDisplayStyles';
import StatusIcons from '../FeatureSummary/StatusIcons';
import ScenarioStep from './components/ScenarioStep';
import ScenarioInputField from './components/ScenarioInputField';

interface StepChange {
  stepId: string;
  status: Status;
}

interface Props {
  scenario: Scenario;
  handleCommentUpdate(scenarioId: string, label: string, requestLabel: string, prevContent: string, content: string): void;
  handleStatusChange(scenarioId: string, oldStatusMap: StepChange[], newStatusMap: StepChange[]): void;
}

const ScenarioDisplay: FC<Props> = ({ scenario, handleCommentUpdate, handleStatusChange }) => {
  const [expanded, setExpanded] = useState(false);
  const classes = useScenarioDisplayStyles();
  const { t } = useTranslation();

  const classesMap: StatusMap<string> = {
    [Passed]: classes.xbddScenarioPassed,
    [Failed]: classes.xbddScenarioFailed,
    [Undefined]: classes.xbddScenarioUndefined,
    [Skipped]: classes.xbddScenarioSkipped,
  };

  const { id, calculatedStatus, originalAutomatedStatus, steps, backgroundSteps, environmentNotes, testingTips, executionNotes } = scenario;

  let className = expanded ? classes.expandedScenarioTitle : '';

  if (calculatedStatus) {
    className += ` ${classesMap[calculatedStatus]}`;
  } else {
    className += ` ${classesMap[originalAutomatedStatus]}`;
  }

  const getChangeAllSteps = (newStatus: Status) => (): void =>
    handleStatusChange(
      id,
      [...backgroundSteps, ...steps].map(step => ({ stepId: step.id, status: step.manualStatus || step.status })),
      [...backgroundSteps, ...steps].map(step => ({ stepId: step.id, status: newStatus }))
    );

  const boundStatusChange = (oldStatusMap: StepChange[], newStatusMap: StepChange[]): void =>
    handleStatusChange(id, oldStatusMap, newStatusMap);

  const boundCommentUpdate = (label: string, requestLabel: string, prevContent: string, content: string): void =>
    handleCommentUpdate(id, label, requestLabel, prevContent, content);

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
            {backgroundSteps && (
              <ScenarioStep title={t('report.backgroundSteps')} steps={backgroundSteps} handleStatusChange={boundStatusChange} />
            )}
          </Grid>
          <Grid item xs={11}>
            {steps && <ScenarioStep title={t('report.steps')} steps={steps} handleStatusChange={boundStatusChange} />}
          </Grid>
          <Grid item xs={5}>
            <ScenarioInputField label={t('report.environment')} value={environmentNotes} handleCommentUpdate={boundCommentUpdate} />
          </Grid>
          <Grid item xs={1} />
          <Grid item xs={5}>
            <ScenarioInputField label={t('report.executionNotes')} value={executionNotes} handleCommentUpdate={boundCommentUpdate} />
          </Grid>
          <Grid item xs={11}>
            <ScenarioInputField label={t('report.testingTips')} value={testingTips} handleCommentUpdate={boundCommentUpdate} />
          </Grid>
          <Grid item xs={11}>
            <div className={classes.buttons}>
              <Button variant="contained" size="small" onClick={getChangeAllSteps(Skipped)} className={classes.skipAllSteps}>
                {t('report.skipAllSteps')}
              </Button>
              <Button variant="contained" size="small" onClick={getChangeAllSteps(Passed)} className={classes.skipAllSteps}>
                {t('report.passAllSteps')}
              </Button>
            </div>
          </Grid>
        </Grid>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
};

export default ScenarioDisplay;

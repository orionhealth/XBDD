import React, { FC, MouseEvent, ReactNode } from 'react';
import { List, ListItem, Box } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinusSquare, faCheckSquare } from '@fortawesome/free-solid-svg-icons';
import { faSquare } from '@fortawesome/free-regular-svg-icons';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';

import { stepStyles } from './styles/ScenarioStepStyles';
import PopperMenu from './PopperMenu';
import CucumberTable from './CucumberTable';
import Step from 'models/Step';
import Status, { Passed, Failed, Skipped, Undefined, StatusMap } from 'models/Status';
import StepScreenshot from './StepScreenshot';
import { updateStepStatusWithRollback } from 'redux/FeatureReducer';

interface Props extends WithStyles {
  title: string;
  steps: Step[];
  scenarioId: string;
}

const ScenarioStep: FC<Props> = ({ scenarioId, title, steps, classes }) => {
  const iconMap: StatusMap<ReactNode> = {
    [Passed]: <FontAwesomeIcon icon={faCheckSquare} className={`${classes.scenarioStepStatusPassed} ${classes.scenarioStepIcon}`} />,
    [Failed]: <FontAwesomeIcon icon={faMinusSquare} className={`${classes.scenarioStepStatusFailed} ${classes.scenarioStepIcon}`} />,
    [Skipped]: <FontAwesomeIcon icon={faMinusSquare} className={`${classes.scenarioStepStatusSkipped} ${classes.scenarioStepIcon}`} />,
    [Undefined]: <FontAwesomeIcon icon={faSquare} className={classes.scenarioStepIcon} />,
  };

  const dispatch = useDispatch();

  const onStepStatusChange = (event: MouseEvent<HTMLElement>, stepId: number, prevStatus: Status, newStatus: Status | null): void => {
    event.stopPropagation();

    const nextStatus: StatusMap<Status> = {
      [Passed]: Failed,
      [Failed]: Passed,
      [Undefined]: Passed,
      [Skipped]: Passed,
    };

    const status = newStatus ? newStatus : nextStatus[prevStatus];

    dispatch(updateStepStatusWithRollback(scenarioId, stepId, status));
  };

  return (
    <div className={classes.steps}>
      <div className={classes.stepTitle}>{title}</div>
      <List>
        {steps.map(
          (step: Step): ReactNode => {
            const status = step.manualStatus ? step.manualStatus : step.status;
            const stepTextClasses = status === Skipped ? classes.skippedStepText : undefined;
            return (
              <div key={step.id}>
                <ListItem
                  button
                  className={classes.step}
                  onClick={(e: MouseEvent<HTMLElement>): void => onStepStatusChange(e, step.id, status, null)}
                >
                  <Box display="flex" flexDirection="row">
                    <Box p={1} className={classes.stepIconBox}>
                      {iconMap[status]}
                    </Box>
                    <Box p={1} className={classes.stepContentBox}>
                      <div className={stepTextClasses}>
                        <span className={classes.stepKeyword}>{step.keyword}</span>
                        <span>{`${step.name} `}</span>
                        <PopperMenu stepId={step.id} status={status} onStepStatusChange={onStepStatusChange} />
                      </div>
                      {step.rows ? <CucumberTable rows={step.rows} /> : null}
                    </Box>
                  </Box>
                </ListItem>
                {step.embeddings && step.embeddings.map(embedding => <StepScreenshot key={embedding} screenshotPath={embedding} />)}
              </div>
            );
          }
        )}
      </List>
    </div>
  );
};

export default withStyles(stepStyles)(ScenarioStep);

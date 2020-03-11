import React, { FC, KeyboardEvent, MouseEvent, ReactNode } from 'react';
import { List, ListItem, Box } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinusSquare, faCheckSquare } from '@fortawesome/free-solid-svg-icons';
import { faSquare } from '@fortawesome/free-regular-svg-icons';
import { withStyles, WithStyles } from '@material-ui/core/styles';

import { stepStyles } from './styles/ScenarioStepStyles';
import PopperMenu from './PopperMenu';
import CucumberTable from './CucumberTable';
import Step from 'models/Step';
import Status from 'models/Status';

const { Passed, Failed, Skipped, Undefined } = Status;

interface StepChange {
  stepId: string;
  status: Status;
}

interface Props extends WithStyles {
  title: string;
  scenarioId: string;
  steps: Step[];
  handleStatusChange(scenarioId: string, oldStatusMap: StepChange[], newStatusMap: StepChange[]): void;
  handleScreenshotClicked(screenshot: ReactNode): void;
}

const ScenarioStep: FC<Props> = ({ title, scenarioId, steps, handleStatusChange, handleScreenshotClicked, classes }) => {
  const iconMap: { [key in Status]: ReactNode } = {
    [Passed]: <FontAwesomeIcon icon={faCheckSquare} className={`${classes.scenarioStepStatusPassed} ${classes.scenarioStepIcon}`} />,
    [Failed]: <FontAwesomeIcon icon={faMinusSquare} className={`${classes.scenarioStepStatusFailed} ${classes.scenarioStepIcon}`} />,
    [Undefined]: <FontAwesomeIcon icon={faSquare} className={classes.scenarioStepIcon} />,
    [Skipped]: <FontAwesomeIcon icon={faSquare} className={classes.scenarioStepIcon} />,
  };

  const getFailedClasses = (status: Status): string => {
    return status === Status.Failed ? `${classes.stepIconBox} ${classes.stepIconFailed}` : classes.stepIconBox;
  };

  const onStepStatusChange = (event: MouseEvent<HTMLElement>, stepId: string, prevStatus: Status, newStatus: Status | null): void => {
    event.stopPropagation();

    const nextStatus: { [key in Status]: Status } = {
      [Passed]: Failed,
      [Failed]: Passed,
      [Undefined]: Passed,
      [Skipped]: Passed,
    };

    const status = newStatus ? newStatus : nextStatus[prevStatus];
    const prevStatusMap = [{ stepId: stepId, status: prevStatus }];
    const newStatusMap = [{ stepId: stepId, status: status }];

    handleStatusChange(scenarioId, prevStatusMap, newStatusMap);
  };

  const renderScreenshot = (embeddings: string): ReactNode => {
    const url = `${process.env.REACT_APP_BACKEND_HOST}/attachment/${embeddings}`;
    const alt = '';
    const style = { height: '100%', width: '100%' };
    const onClick = (): void => handleScreenshotClicked(<img src={url} alt={alt} style={style} />);
    return (
      <span
        onClick={onClick}
        onKeyPress={(e: KeyboardEvent<HTMLElement>): void => {
          if (e.key === 'Enter') {
            onClick();
          }
        }}
      >
        <img src={url} alt={alt} className={classes.screenshot} />
      </span>
    );
  };

  return (
    <div className={classes.steps}>
      <div className={classes.stepTitle}>{title}</div>
      <List>
        {steps.map(
          (step: Step): ReactNode => {
            const status = step.manualStatus ? step.manualStatus : step.status;
            return (
              <div key={step.id}>
                <ListItem
                  button
                  className={classes.step}
                  onClick={(e: MouseEvent<HTMLElement>): void => onStepStatusChange(e, step.id, status, null)}
                >
                  <Box display="flex" flexDirection="row">
                    <Box p={1} className={getFailedClasses(status)}>
                      {iconMap[status]}
                    </Box>
                    <Box p={1} className={classes.stepContentBox}>
                      <div>
                        <span className={classes.stepKeyword}>{step.keyword}</span>
                        <span>{`${step.name} `}</span>
                        <PopperMenu stepId={step.id} status={status} onStepStatusChange={onStepStatusChange} />
                      </div>
                      {step.rows ? <CucumberTable rows={step.rows} /> : null}
                    </Box>
                  </Box>
                </ListItem>
                {step.embeddings ? renderScreenshot(step.embeddings) : null}
              </div>
            );
          }
        )}
      </List>
    </div>
  );
};

export default withStyles(stepStyles)(ScenarioStep);

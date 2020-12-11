import React, { FC, MouseEvent, ReactNode } from 'react';
import { ListItem } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinusSquare, faCheckSquare } from '@fortawesome/free-solid-svg-icons';
import { faSquare } from '@fortawesome/free-regular-svg-icons';
import { useDispatch } from 'react-redux';

import { useStepStyles } from './styles/ScenarioComponentsStyles';
import PopperMenu from './PopperMenu';
import CucumberTable from './CucumberTable';
import Step from 'models/Step';
import Status, { Passed, Failed, Skipped, Undefined, StatusMap } from 'models/Status';
import { updateStepStatusWithRollback } from 'redux/FeatureReducer';
import { useStatusColorStyles } from 'modules/styles/globalStyles';

interface Props {
  scenarioId: string;
  step: Step;
}

const ScenarioStep: FC<Props> = ({ scenarioId, step }) => {
  const dispatch = useDispatch();
  const classes = useStepStyles();

  const classesMap = useStatusColorStyles();

  const iconMap: StatusMap<ReactNode> = {
    [Passed]: <FontAwesomeIcon icon={faCheckSquare} className={classesMap.passed} />,
    [Failed]: <FontAwesomeIcon icon={faMinusSquare} className={classesMap.failed} />,
    [Skipped]: <FontAwesomeIcon icon={faMinusSquare} className={classesMap.skipped} />,
    [Undefined]: <FontAwesomeIcon icon={faSquare} />,
  };

  const onStepStatusChange = (e: MouseEvent<HTMLElement>, stepId: number, status: Status): void => {
    e.stopPropagation();

    const nextStatus: StatusMap<Status> = {
      [Passed]: Failed,
      [Failed]: Passed,
      [Undefined]: Passed,
      [Skipped]: Passed,
    };

    dispatch(updateStepStatusWithRollback(scenarioId, stepId, nextStatus[status]));
  };

  const status = step.manualStatus || step.status;
  const stepTextClasses = status === Skipped ? classes.skippedStepText : undefined;

  return (
    <ListItem button className={classes.step} onClick={(e: MouseEvent<HTMLElement>): void => onStepStatusChange(e, step.id, status)}>
      <div className={classes.stepIconBox}>{iconMap[status]}</div>
      <div className={classes.stepContentBox}>
        <div className={stepTextClasses}>
          <span className={classes.stepKeyword}>{step.keyword}</span>
          <span>{`${step.name} `}</span>
          <PopperMenu scenarioId={scenarioId} stepId={step.id} />
        </div>
        {step.rows ? <CucumberTable rows={step.rows} /> : null}
      </div>
    </ListItem>
  );
};

export default ScenarioStep;

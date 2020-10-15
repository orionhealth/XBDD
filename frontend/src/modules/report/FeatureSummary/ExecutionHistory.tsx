import React, { FC, ReactNode } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tooltip, Typography, IconButton } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationCircle, faQuestionCircle, faMinusCircle } from '@fortawesome/free-solid-svg-icons';
import { withStyles, WithStyles } from '@material-ui/core/styles';

import { executionHistoryStyles } from './styles/FeatureSummaryStyles';
import Execution from 'models/Execution';
import { StatusMap, Passed, Failed, Skipped, Undefined } from 'models/Status';
import { useHistory } from 'react-router-dom';
import { resetFeatureState } from 'redux/FeatureReducer';
import { RootStore } from 'rootReducer';

interface Props extends WithStyles {
  executionHistory: Execution[];
}

const ExecutionHistory: FC<Props> = ({ executionHistory, classes }) => {
  const history = useHistory();
  const dispatch = useDispatch();

  const report = useSelector((state: RootStore) => state.report);

  const iconMap: StatusMap<ReactNode> = {
    [Passed]: <FontAwesomeIcon icon={faCheckCircle} className={classes.featurePassed} />,
    [Failed]: <FontAwesomeIcon icon={faExclamationCircle} className={classes.featureFailed} />,
    [Undefined]: <FontAwesomeIcon icon={faQuestionCircle} className={classes.featureUndefined} />,
    [Skipped]: <FontAwesomeIcon icon={faMinusCircle} className={classes.featureSkipped} />,
  };

  const navigateToBuild = (build: string) => {
    if (report.build === build) {
      return;
    }
    dispatch(resetFeatureState());
    history.push(encodeURI(`/reports/${report.product}/${report.version}/${build}`));
  };

  return (
    <div className={classes.executionHistory}>
      <Typography variant="body2">Execution History</Typography>
      {executionHistory.map(build => (
        <span key={build.build}>
          <Tooltip title={build.build} placement="top">
            <IconButton className={classes.executionHistoryIcon} onClick={() => navigateToBuild(build.build)}>
              {iconMap[build.calculatedStatus]}
            </IconButton>
          </Tooltip>
        </span>
      ))}
    </div>
  );
};

export default withStyles(executionHistoryStyles)(ExecutionHistory);

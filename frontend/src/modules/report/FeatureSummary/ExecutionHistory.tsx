import React, { FC, ReactNode } from 'react';
import { Tooltip, Typography, IconButton } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationCircle, faQuestionCircle, faMinusCircle } from '@fortawesome/free-solid-svg-icons';
import { withStyles, WithStyles } from '@material-ui/core/styles';

import { executionHistoryStyles } from './styles/FeatureSummaryStyles';
import Execution from 'models/Execution';
import { StatusMap, Passed, Failed, Skipped, Undefined } from 'models/Status';

interface Props extends WithStyles {
  executionHistory: Execution[];
}

const ExecutionHistory: FC<Props> = ({ executionHistory, classes }) => {
  const iconMap: StatusMap<ReactNode> = {
    [Passed]: <FontAwesomeIcon icon={faCheckCircle} className={classes.featurePassed} />,
    [Failed]: <FontAwesomeIcon icon={faExclamationCircle} className={classes.featureFailed} />,
    [Undefined]: <FontAwesomeIcon icon={faQuestionCircle} className={classes.featureUndefined} />,
    [Skipped]: <FontAwesomeIcon icon={faMinusCircle} className={classes.featureSkipped} />,
  };

  return (
    <div className={classes.executionHistory}>
      <Typography variant="body2">Execution History</Typography>
      {executionHistory.map(build => (
        <span key={build.build}>
          <Tooltip title={build.build} placement="top">
            <IconButton className={classes.executionHistoryIcon}>{iconMap[build.calculatedStatus]}</IconButton>
          </Tooltip>
        </span>
      ))}
    </div>
  );
};

export default withStyles(executionHistoryStyles)(ExecutionHistory);

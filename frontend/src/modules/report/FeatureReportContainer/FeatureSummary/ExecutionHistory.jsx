import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip, Typography, IconButton } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationCircle, faQuestionCircle, faMinusCircle } from '@fortawesome/free-solid-svg-icons';
import { withStyles } from '@material-ui/core/styles';

import { executionHistoryStyles } from './styles/FeatureSummaryStyles';

const ExecutionHistory = props => {
  const { executionHistory, classes } = props;

  const iconMap = {
    passed: <FontAwesomeIcon icon={faCheckCircle} className={classes.xbddFeaturePassed} />,
    failed: <FontAwesomeIcon icon={faExclamationCircle} className={classes.xbddFeatureFailed} />,
    undefined: <FontAwesomeIcon icon={faQuestionCircle} className={classes.xbddFeatureUndefined} />,
    skipped: <FontAwesomeIcon icon={faMinusCircle} className={classes.xbddFeatureSkipped} />,
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

ExecutionHistory.propTypes = {
  executionHistory: PropTypes.arrayOf(PropTypes.shape({})),
  classes: PropTypes.shape({}).isRequired,
};

export default withStyles(executionHistoryStyles)(ExecutionHistory);

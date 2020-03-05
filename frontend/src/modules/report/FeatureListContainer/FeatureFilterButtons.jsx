import React from 'react';
import { PropTypes } from 'prop-types';
import { Card, IconButton, Tooltip } from '@material-ui/core';
import { CheckCircleOutline, ErrorOutline, RemoveCircleOutline, HelpOutline } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import { filterButtonStyles } from './styles/FeatureListContainerStyles';

const createButton = variant => (
  <Tooltip title={variant.tooltip} placement="top">
    <IconButton className={`${variant.colorClass} ${variant.buttonClass}`} onClick={variant.handler} variant="outlined">
      {variant.icon}
    </IconButton>
  </Tooltip>
);

const FeatureFilterButtons = props => {
  const { selectedStatus, handleFilterButtonClick, classes } = props;
  const variants = {
    passed: {
      icon: <CheckCircleOutline />,
      tooltip: 'Passed',
      colorClass: selectedStatus.passed ? classes.xbddFilterButtonPassed : classes.xbddFilterButtonUnselected,
      handler: () => handleFilterButtonClick('passed'),
      buttonClass: `${classes.xbddFilterButton}`,
    },
    failed: {
      icon: <ErrorOutline />,
      tooltip: 'Failed',
      colorClass: selectedStatus.failed ? classes.xbddFilterButtonFailed : classes.xbddFilterButtonUnselected,
      handler: () => handleFilterButtonClick('failed'),
      buttonClass: `${classes.xbddFilterButton}`,
    },
    undefined: {
      icon: <HelpOutline />,
      tooltip: 'Undefined',
      colorClass: selectedStatus.undefined ? classes.xbddFilterButtonUndefined : classes.xbddFilterButtonUnselected,
      handler: () => handleFilterButtonClick('undefined'),
      buttonClass: `${classes.xbddFilterButton}`,
    },
    skipped: {
      icon: <RemoveCircleOutline />,
      tooltip: 'Skipped',
      colorClass: selectedStatus.skipped ? classes.xbddFilterButtonSkipped : classes.xbddFilterButtonUnselected,
      handler: () => handleFilterButtonClick('skipped'),
      buttonClass: `${classes.xbddFilterButton}`,
    },
  };

  return (
    <div className={classes.xbddFilterButtons}>
      <Card raised>
        {createButton(variants.passed)}
        {createButton(variants.failed)}
        {createButton(variants.undefined)}
        {createButton(variants.skipped)}
      </Card>
    </div>
  );
};

FeatureFilterButtons.propTypes = {
  selectedStatus: PropTypes.shape({}).isRequired,
  handleFilterButtonClick: PropTypes.func.isRequired,
  classes: PropTypes.shape({}).isRequired,
};

export default withStyles(filterButtonStyles)(FeatureFilterButtons);

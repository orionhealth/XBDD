import React, { FC } from 'react';
import { Forward } from '@material-ui/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationCircle, faQuestionCircle, faMinusCircle } from '@fortawesome/free-solid-svg-icons';
import { withStyles, WithStyles } from '@material-ui/core/styles';

import { statusIconStyles } from './styles/FeatureSummaryStyles';

interface Props extends WithStyles<typeof statusIconStyles> {
  firstStatus: string;
  secondStatus: string;
  size: string;
}

const StatusIcons: FC<Props> = props => {
  const { firstStatus, secondStatus, size, classes } = props;
  let sizeClasses = classes.bigIcons;
  if (size === 'small') {
    sizeClasses = classes.smallIcons;
  }

  const iconMap = {
    passed: <FontAwesomeIcon icon={faCheckCircle} className={`${classes.xbddFeaturePassed} ${sizeClasses}`} />,
    failed: <FontAwesomeIcon icon={faExclamationCircle} className={`${classes.xbddFeatureFailed} ${sizeClasses}`} />,
    undefined: <FontAwesomeIcon icon={faQuestionCircle} className={`${classes.xbddFeatureUndefined} ${sizeClasses}`} />,
    skipped: <FontAwesomeIcon icon={faMinusCircle} className={`${classes.xbddFeatureSkipped} ${sizeClasses}`} />,
  };

  return (
    <div className={classes.xbddFeatureStatus}>
      {iconMap[firstStatus]}
      <Forward className={`${classes.xbddFeatureStatusArrow} ${sizeClasses}`} />
      {iconMap[secondStatus]}
    </div>
  );
};

export default withStyles(statusIconStyles)(StatusIcons);

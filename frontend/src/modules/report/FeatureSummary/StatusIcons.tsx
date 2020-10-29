import React, { FC } from 'react';
import { Forward } from '@material-ui/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationCircle, faQuestionCircle, faMinusCircle } from '@fortawesome/free-solid-svg-icons';

import { useStatusIconStyles } from './styles/FeatureSummaryStyles';

interface Props {
  firstStatus: string;
  secondStatus: string;
  size?: string;
}

const StatusIcons: FC<Props> = props => {
  const classes = useStatusIconStyles();
  const { firstStatus, secondStatus, size } = props;
  let sizeClasses = classes.bigIcons;
  if (size === 'small') {
    sizeClasses = classes.smallIcons;
  }

  const iconMap = {
    passed: <FontAwesomeIcon icon={faCheckCircle} className={`${classes.featurePassed} ${sizeClasses}`} />,
    failed: <FontAwesomeIcon icon={faExclamationCircle} className={`${classes.featureFailed} ${sizeClasses}`} />,
    undefined: <FontAwesomeIcon icon={faQuestionCircle} className={`${classes.featureUndefined} ${sizeClasses}`} />,
    skipped: <FontAwesomeIcon icon={faMinusCircle} className={`${classes.featureSkipped} ${sizeClasses}`} />,
  };

  return (
    <div className={classes.featureStatus}>
      {iconMap[firstStatus]}
      <Forward className={`${classes.featureStatusArrow} ${sizeClasses}`} />
      {iconMap[secondStatus]}
    </div>
  );
};

export default StatusIcons;

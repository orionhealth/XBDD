import React, { FC } from 'react';
import { Forward } from '@material-ui/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationCircle, faQuestionCircle, faMinusCircle } from '@fortawesome/free-solid-svg-icons';

import { useStatusIconStyles } from './styles/FeatureSummaryStyles';
import { useStatusColorStyles } from 'modules/styles/globalStyles';
import { Failed, Passed, Skipped, Undefined } from 'models/Status';

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

  const classesMap = useStatusColorStyles();

  const iconMap = {
    [Passed]: <FontAwesomeIcon icon={faCheckCircle} className={`${classesMap[Passed]} ${sizeClasses}`} />,
    [Failed]: <FontAwesomeIcon icon={faExclamationCircle} className={`${classesMap[Failed]} ${sizeClasses}`} />,
    [Undefined]: <FontAwesomeIcon icon={faQuestionCircle} className={`${classesMap[Undefined]} ${sizeClasses}`} />,
    [Skipped]: <FontAwesomeIcon icon={faMinusCircle} className={`${classesMap[Skipped]} ${sizeClasses}`} />,
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

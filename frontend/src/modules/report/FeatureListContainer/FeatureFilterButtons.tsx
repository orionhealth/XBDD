import React, { FC, ReactNode } from 'react';
import { Card, IconButton, Tooltip } from '@material-ui/core';
import { CheckCircleOutline, ErrorOutline, RemoveCircleOutline, HelpOutline } from '@material-ui/icons';
import { useTranslation } from 'react-i18next';

import Status, { StatusMap, Passed, Failed, Skipped, Undefined, Statuses } from 'models/Status';
import { useFeatureFilterButtonStyles } from './styles/FeatureListContainerStyles';
import { useStatusColorStyles } from 'modules/styles/globalStyles';

interface Props {
  selectedStatus: StatusMap<boolean>;
  handleFilterButtonClick(status: Status): void;
}

interface FilterButtonProps {
  status: Status;
  selectedStatus: StatusMap<boolean>;
  handleFilterButtonClick(status: Status): void;
}

const FilterButton: FC<FilterButtonProps> = ({ status, selectedStatus, handleFilterButtonClick }) => {
  const { t } = useTranslation();
  const classes = useFeatureFilterButtonStyles();
  const classesMap = useStatusColorStyles();

  const tooltipsMap: StatusMap<string> = {
    [Passed]: t('report.passed'),
    [Failed]: t('report.failed'),
    [Undefined]: t('report.undefined'),
    [Skipped]: t('report.skipped'),
  };

  const iconMap: StatusMap<ReactNode> = {
    [Passed]: <CheckCircleOutline />,
    [Failed]: <ErrorOutline />,
    [Undefined]: <HelpOutline />,
    [Skipped]: <RemoveCircleOutline />,
  };

  const iconColorClasses = selectedStatus[status] ? classesMap[status] : classes.buttonUnselected;
  const iconClasses = `${classes.button} ${iconColorClasses}`;

  return (
    <Tooltip key={status} title={tooltipsMap[status]} placement="top">
      <IconButton className={iconClasses} onClick={(): void => handleFilterButtonClick(status)}>
        {iconMap[status]}
      </IconButton>
    </Tooltip>
  );
};

const FeatureFilterButtons: FC<Props> = ({ selectedStatus, handleFilterButtonClick }) => {
  const classes = useFeatureFilterButtonStyles();

  const statuses = Statuses;

  return (
    <div className={classes.buttons}>
      <Card raised>
        {statuses.map(status => (
          <FilterButton key={status} status={status} selectedStatus={selectedStatus} handleFilterButtonClick={handleFilterButtonClick} />
        ))}
      </Card>
    </div>
  );
};

export default FeatureFilterButtons;

import React, { FC, ReactNode } from 'react';
import { Card, IconButton, Tooltip } from '@material-ui/core';
import { CheckCircleOutline, ErrorOutline, RemoveCircleOutline, HelpOutline } from '@material-ui/icons';
import { useTranslation } from 'react-i18next';

import Status, { StatusMap, Passed, Failed, Skipped, Undefined } from 'models/Status';
import { useFeatureFilterButtonStyles } from '../styles/FeatureListContainerStyles';
import { useStatusColorStyles } from 'modules/styles/globalStyles';

interface Props {
  selectedStatus: StatusMap<boolean>;
  handleFilterButtonClick(status: Status): void;
}

const FeatureFilterButtons: FC<Props> = ({ selectedStatus, handleFilterButtonClick }) => {
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

  const renderFilterButton = (status: Status): ReactNode => {
    const iconColorClasses = selectedStatus[status] ? classesMap[status] : classes.buttonUnselected;
    const iconClasses = `${classes.button} ${iconColorClasses}`;

    return (
      <Tooltip title={tooltipsMap[status]} placement="top">
        <IconButton className={iconClasses} onClick={(): void => handleFilterButtonClick(status)}>
          {iconMap[status]}
        </IconButton>
      </Tooltip>
    );
  };

  return (
    <div className={classes.buttons}>
      <Card raised>
        {renderFilterButton(Passed)}
        {renderFilterButton(Failed)}
        {renderFilterButton(Undefined)}
        {renderFilterButton(Skipped)}
      </Card>
    </div>
  );
};

export default FeatureFilterButtons;

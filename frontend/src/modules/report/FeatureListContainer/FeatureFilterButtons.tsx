import React, { FC, ReactNode } from 'react';
import { Card, IconButton, Tooltip } from '@material-ui/core';
import { CheckCircleOutline, ErrorOutline, RemoveCircleOutline, HelpOutline } from '@material-ui/icons';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import Status, { StatusMap, Passed, Failed, Skipped, Undefined, Statuses, SelectedStatuses } from 'models/Status';
import { useFeatureFilterButtonStyles } from './styles/FeatureListContainerStyles';
import { useStatusColorStyles } from 'modules/styles/globalStyles';
import { RootStore } from 'rootReducer';

interface FilterButtonProps {
  status: Status;
}

const generateQueryParams = (selectedStatuses: SelectedStatuses, status: Status): string => {
  let queryParams = '';
  Object.entries(selectedStatuses).forEach(([key, val]) => {
    if (key === status && val) {
      queryParams += `hidden=${key}&`;
    }
    if (key !== status && !val) {
      queryParams += `hidden=${key}&`;
    }
  });
  return queryParams.slice(0, -1);
};

const FilterButton: FC<FilterButtonProps> = ({ status }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const classes = useFeatureFilterButtonStyles();
  const classesMap = useStatusColorStyles();

  const selectedStatuses = useSelector((state: RootStore) => state.feature.selectedStatuses);

  const handleFilterButtonClick = (): void => {
    const queryParams = generateQueryParams(selectedStatuses, status);
    history.push({ search: queryParams });
  };

  const iconMap: StatusMap<ReactNode> = {
    [Passed]: <CheckCircleOutline />,
    [Failed]: <ErrorOutline />,
    [Undefined]: <HelpOutline />,
    [Skipped]: <RemoveCircleOutline />,
  };

  const iconColorClasses = selectedStatuses[status] ? classesMap[status] : classes.buttonUnselected;
  const iconClasses = `${classes.button} ${iconColorClasses}`;

  return (
    <Tooltip key={status} title={t(`report.${status}`) || ''} placement="top">
      <IconButton className={iconClasses} onClick={handleFilterButtonClick}>
        {iconMap[status]}
      </IconButton>
    </Tooltip>
  );
};

const FeatureFilterButtons: FC = () => {
  const classes = useFeatureFilterButtonStyles();

  const statuses = Statuses;

  return (
    <div className={classes.buttons}>
      <Card raised>
        {statuses.map(status => (
          <FilterButton key={status} status={status} />
        ))}
      </Card>
    </div>
  );
};

export default FeatureFilterButtons;

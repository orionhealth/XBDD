import React, { FC } from 'react';
import { Card } from '@material-ui/core';
import { CheckCircleOutline, ErrorOutline, RemoveCircleOutline, HelpOutline } from '@material-ui/icons';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';

import Status, { StatusMap, Passed, Failed, Skipped, Undefined } from 'models/Status';
import FilterButton from './FilterButton';

const useStyles = makeStyles(() =>
  createStyles({
    buttons: {
      padding: '24px 24px 12px 24px',
    },
    buttonPassed: {
      color: '#576E5D',
    },
    buttonFailed: {
      color: '#AC534F',
    },
    buttonUndefined: {
      color: '#C39575',
    },
    buttonSkipped: {
      color: '#457B9D',
      borderRight: 'hidden',
    },
    buttonUnselected: {
      color: '#E0E0E0',
    },
  })
);

interface Props {
  selectedStatus: StatusMap<boolean>;
  handleFilterButtonClick(status: Status): void;
}

const FeatureFilterButtons: FC<Props> = ({ selectedStatus, handleFilterButtonClick }) => {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <div className={classes.buttons}>
      <Card raised>
        <FilterButton
          tooltip={t('report.passed')}
          colorClass={selectedStatus.passed ? classes.buttonPassed : classes.buttonUnselected}
          onClick={(): void => handleFilterButtonClick(Passed)}
        >
          <CheckCircleOutline />
        </FilterButton>
        <FilterButton
          tooltip={t('report.failed')}
          colorClass={selectedStatus.failed ? classes.buttonFailed : classes.buttonUnselected}
          onClick={(): void => handleFilterButtonClick(Failed)}
        >
          <ErrorOutline />
        </FilterButton>
        <FilterButton
          tooltip={t('report.undefined')}
          colorClass={selectedStatus.undefined ? classes.buttonUndefined : classes.buttonUnselected}
          onClick={(): void => handleFilterButtonClick(Undefined)}
        >
          <HelpOutline />
        </FilterButton>
        <FilterButton
          tooltip={t('report.skipped')}
          colorClass={selectedStatus.skipped ? classes.buttonSkipped : classes.buttonUnselected}
          onClick={(): void => handleFilterButtonClick(Skipped)}
        >
          <RemoveCircleOutline />
        </FilterButton>
      </Card>
    </div>
  );
};

export default FeatureFilterButtons;

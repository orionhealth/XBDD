import React, { FC, MouseEvent, ReactNode, useState, useRef } from 'react';
import { IconButton, Popper, Fade, Card, List, ListItem } from '@material-ui/core';
import { MoreHoriz } from '@material-ui/icons';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';

import Status from 'models/Status';

const { Passed, Failed, Undefined, Skipped } = Status;

const useStyles = makeStyles(() =>
  createStyles({
    scenarioStepIcon: {
      fontSize: '16px',
    },
    moreButton: {
      padding: '0px',
    },
    popperMenu: {
      zIndex: 999,
    },
  })
);

interface Props {
  stepId: string;
  status: Status;
  onStepStatusChange(e: MouseEvent<HTMLElement>, stepId: string, status: Status, newStatus: Status): void;
}

const PopperMenu: FC<Props> = ({ stepId, status, onStepStatusChange }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const ref = useRef(null);
  const [open, setOpen] = useState(false);

  const labelMap = {
    passed: t('report.pass'),
    failed: t('report.fail'),
    skipped: t('report.skip'),
    undefined: t('report.undefined'),
  };

  const renderListItem = (newStatus: Status): ReactNode => (
    <ListItem button onClick={(e: MouseEvent<HTMLElement>): void => onStepStatusChange(e, stepId, status, newStatus)}>
      {labelMap[newStatus]}
    </ListItem>
  );

  return (
    <span ref={ref} onMouseEnter={(): void => setOpen(true)} onMouseLeave={(): void => setOpen(false)}>
      <IconButton className={classes.moreButton}>
        <MoreHoriz className={classes.scenarioStepIcon} />
      </IconButton>
      <Popper open={open} anchorEl={ref?.current} transition className={classes.popperMenu}>
        {({ TransitionProps }): ReactNode => (
          <Fade {...TransitionProps} timeout={350}>
            <Card>
              <List>
                {renderListItem(Passed)}
                {renderListItem(Failed)}
                {renderListItem(Skipped)}
                {renderListItem(Undefined)}
              </List>
            </Card>
          </Fade>
        )}
      </Popper>
    </span>
  );
};

export default PopperMenu;

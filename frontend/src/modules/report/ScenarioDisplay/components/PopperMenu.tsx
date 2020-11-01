import React, { FC, MouseEvent, ReactNode, useState, useRef } from 'react';
import { IconButton, Popper, Fade, Card, List, ListItem } from '@material-ui/core';
import { MoreHoriz } from '@material-ui/icons';
import { useTranslation } from 'react-i18next';

import Status, { Passed, Failed, Skipped, Undefined, StatusMap } from 'models/Status';
import { usePopperMenuStyles } from './styles/ScenarioComponentsStyles';

interface Props {
  stepId: number;
  status: Status;
  onStepStatusChange(e: MouseEvent<HTMLElement>, stepId: number, status: Status, newStatus: Status): void;
}

const PopperMenu: FC<Props> = ({ stepId, status, onStepStatusChange }) => {
  const classes = usePopperMenuStyles();
  const { t } = useTranslation();
  const ref = useRef(null);
  const [open, setOpen] = useState(false);

  const labelMap: StatusMap<string> = {
    [Passed]: t('report.pass'),
    [Failed]: t('report.fail'),
    [Skipped]: t('report.skip'),
    [Undefined]: t('report.undefined'),
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

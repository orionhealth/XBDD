import React, { FC, MouseEvent, ReactNode, useState, useRef } from 'react';
import { IconButton, Popper, Fade, Card, List, ListItem } from '@material-ui/core';
import { MoreHoriz } from '@material-ui/icons';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import Status, { Statuses } from 'models/Status';
import { usePopperMenuStyles } from './styles/ScenarioComponentsStyles';
import { updateStepStatusWithRollback } from 'redux/FeatureReducer';

interface Props {
  scenarioId: string;
  stepId: number;
}

interface MenuListItemProps {
  scenarioId: string;
  stepId: number;
  status: Status;
}

const MenuListItem: FC<MenuListItemProps> = ({ scenarioId, stepId, status }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const onStepStatusChange = (e: MouseEvent<HTMLElement>): void => {
    e.stopPropagation();
    dispatch(updateStepStatusWithRollback(scenarioId, stepId, status));
  };

  return (
    <ListItem button onClick={onStepStatusChange}>
      {t(`report.${status}`)}
    </ListItem>
  );
};

const PopperMenu: FC<Props> = ({ scenarioId, stepId }) => {
  const classes = usePopperMenuStyles();
  const ref = useRef(null);
  const [open, setOpen] = useState(false);

  const statuses = Statuses;

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
                {statuses.map(status => (
                  <MenuListItem key={status} scenarioId={scenarioId} stepId={stepId} status={status} />
                ))}
              </List>
            </Card>
          </Fade>
        )}
      </Popper>
    </span>
  );
};

export default PopperMenu;

import React, { FC, MouseEvent, ReactNode, useState, useRef } from 'react';
import { IconButton, Popper, Fade, Card, List, ListItem } from '@material-ui/core';
import { MoreHoriz } from '@material-ui/icons';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import Status, { Passed, Failed, Skipped, Undefined, Statuses } from 'models/Status';
import { usePopperMenuStyles } from './styles/ScenarioComponentsStyles';
import { updateStepStatusWithRollback } from 'redux/FeatureReducer';

interface Props {
  scenarioId: string;
  stepId: number;
  stepName: string;
}

interface MenuListItemProps {
  scenarioId: string;
  stepId: number;
  status: Status;
}

const MenuListItem: FC<MenuListItemProps> = ({ scenarioId, stepId, status }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const textMap = {
    [Passed]: t('report.pass'),
    [Failed]: t('report.fail'),
    [Skipped]: t('report.skip'),
    [Undefined]: t('report.undefine'),
  };

  const onStepStatusChange = (e: MouseEvent): void => {
    e.stopPropagation();
    dispatch(updateStepStatusWithRollback(scenarioId, stepId, status));
  };

  return (
    <ListItem button onClick={onStepStatusChange}>
      {textMap[status]}
    </ListItem>
  );
};

const copyToClipboard = (e: MouseEvent, step: string): void => {
  e.stopPropagation();
  navigator.clipboard.writeText(step);
};

const PopperMenu: FC<Props> = ({ scenarioId, stepId, stepName }) => {
  const { t } = useTranslation();
  const ref = useRef(null);
  const [open, setOpen] = useState(false);
  const classes = usePopperMenuStyles();

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
                <ListItem button onClick={(e: MouseEvent): void => copyToClipboard(e, stepName)}>
                  {t(`report.copy`)}
                </ListItem>
              </List>
            </Card>
          </Fade>
        )}
      </Popper>
    </span>
  );
};

export default PopperMenu;

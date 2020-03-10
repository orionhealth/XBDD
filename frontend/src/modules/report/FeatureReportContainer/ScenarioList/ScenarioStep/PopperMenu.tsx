import React, { FC } from 'react';
import { IconButton, Popper, Fade, Card, List, ListItem } from '@material-ui/core';
import { MoreHoriz } from '@material-ui/icons';
import { makeStyles, createStyles } from '@material-ui/core/styles';

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
  scenarioId: string;
  stepId: string;
  anchor: object;
  status: string;
  handleMoreButtonHovered(): void;
  handleMoreButtonNotHovered(): void;
  handleStatusChange(): void;
  clickEventWrapper(): void;
}

const labelMap = {
  passed: 'Pass',
  failed: 'Fail',
  skipped: 'Skip',
  undefined: 'Undefine',
};

const PopperMenu: FC<Props> = ({
  scenarioId,
  stepId,
  anchor,
  status,
  handleMoreButtonHovered,
  handleMoreButtonNotHovered,
  handleStatusChange,
  clickEventWrapper,
}) => {
  const classes = useStyles();

  const renderListItem = newStatus => (
    <ListItem button onClick={e => clickEventWrapper(e, scenarioId, stepId, status, newStatus, handleStatusChange)}>
      {labelMap[newStatus]}
    </ListItem>
  );

  return (
    <span onMouseEnter={e => handleMoreButtonHovered(e)} onMouseLeave={() => handleMoreButtonNotHovered()}>
      <IconButton className={classes.moreButton}>
        <MoreHoriz className={classes.scenarioStepIcon} />
      </IconButton>
      <Popper open={!!anchor} anchorEl={anchor} transition className={classes.popperMenu}>
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Card>
              <List>
                {renderListItem('passed')}
                {renderListItem('failed')}
                {renderListItem('skipped')}
                {renderListItem('undefined')}
              </List>
            </Card>
          </Fade>
        )}
      </Popper>
    </span>
  );
};

export default PopperMenu;

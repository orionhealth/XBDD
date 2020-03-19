import React, { FC, ReactNode } from 'react';
import { IconButton, Tooltip } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() =>
  createStyles({
    button: {
      height: 'calc(100% - 4px)',
      marginTop: '2px',
      marginBottom: '2px',
      borderRadius: 0,
      width: '25%',
      borderRight: '1px solid rgba(0, 0, 0, 0.23)',
    },
  })
);

interface Props {
  children: ReactNode;
  tooltip: string;
  colorClass: string;
  onClick(): void;
}

const FilterButton: FC<Props> = ({ children, tooltip, colorClass, onClick }) => {
  const classes = useStyles();
  return (
    <Tooltip title={tooltip} placement="top">
      <IconButton className={`${colorClass} ${classes.button}`} onClick={onClick}>
        {children}
      </IconButton>
    </Tooltip>
  );
};

export default FilterButton;

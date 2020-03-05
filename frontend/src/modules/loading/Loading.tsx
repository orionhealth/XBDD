import React, { FC } from 'react';
import { makeStyles, Theme, Backdrop, CircularProgress, createStyles } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: theme.palette.primary.main,
    },
  })
);

interface Props {
  loading: boolean;
}

const Loading: FC<Props> = ({ loading }) => {
  const classes = useStyles();
  return (
    <Backdrop className={classes.backdrop} open={loading}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default Loading;

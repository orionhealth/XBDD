import React, { FC } from 'react';
import { Backdrop, CircularProgress } from '@material-ui/core';

import { useLoadingStyles } from './styles/LoadingStyles';

interface Props {
  loading: boolean;
}

const Loading: FC<Props> = ({ loading }) => {
  const classes = useLoadingStyles();
  return (
    <Backdrop className={classes.backdrop} open={loading}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default Loading;

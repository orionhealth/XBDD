import { makeStyles, createStyles } from '@material-ui/core';

export const useBuildListStyles = makeStyles(() =>
  createStyles({
    buildListContainer: {
      height: '100%',
      width: '100%',
    },
    arrowIcon: {
      minWidth: '24px',
    },
  })
);

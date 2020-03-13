import { makeStyles, createStyles } from '@material-ui/core';

export const useBuildListStyles = makeStyles(() =>
  createStyles({
    buildListContainer: {
      height: '100%',
      width: '100%',
    },
    buildListItem: {
      padding: '0 6px',
      height: '42px',
    },
    arrowIcon: {
      minWidth: '24px',
    },
  })
);

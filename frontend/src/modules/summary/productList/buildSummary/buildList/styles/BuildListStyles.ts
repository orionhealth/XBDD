import { makeStyles, createStyles } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';

export const useBuildListStyles = makeStyles(() =>
  createStyles({
    buildListContainer: {
      height: '100%',
      width: '100%',
    },
    arrowIcon: {
      minWidth: '24px',
    },
    unpinnedBuild: {
      color: grey[300]
    },
    pinnedBuild: {
      color: grey[700]
    }
  })
);

import { createStyles, makeStyles, Theme } from '@material-ui/core';

export const useLoadingStyles = makeStyles((theme: Theme) =>
  createStyles({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: theme.palette.primary.main,
    },
  })
);

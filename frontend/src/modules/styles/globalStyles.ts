import { createStyles, makeStyles } from '@material-ui/core';

import { Failed, Passed, Skipped, Undefined } from 'models/Status';

export const useStatusColorStyles = makeStyles(() =>
  createStyles({
    [Passed]: {
      color: '#576E5D',
    },
    [Failed]: {
      color: '#AC534F',
    },
    [Undefined]: {
      color: '#C39575',
    },
    [Skipped]: {
      color: '#457B9D',
    },
  })
);

import { makeStyles, createStyles } from '@material-ui/core';

export const useFeatureListTitleStyles = makeStyles(() =>
  createStyles({
    featureListTitle: {
      display: 'flex',
      alignItems: 'center',
      padding: '4px 12px',
      borderRadius: '4px 4px 0 0',
      backgroundColor: '#457B9D',
      color: 'white',
      textAlign: 'left',
    },
  })
);

export const useViewSwitcherStyles = makeStyles(() =>
  createStyles({
    checkedIcon: {
      color: '#7dc3ff',
      fontSize: '20px',
    },
    unCheckedIcon: {
      fontSize: '20px',
    },
  })
);

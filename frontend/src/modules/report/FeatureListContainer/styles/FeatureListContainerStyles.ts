import { makeStyles, createStyles } from '@material-ui/core';

export const useFeatureListContainerStyles = makeStyles(() =>
  createStyles({
    tagListContainer: {
      padding: '12px 24px 24px 24px',
    },
  })
);

export const useFeatureFilterButtonStyles = makeStyles(() =>
  createStyles({
    button: {
      height: 'calc(100% - 4px)',
      marginTop: '2px',
      marginBottom: '2px',
      borderRadius: 0,
      width: '25%',
      borderRight: '1px solid rgba(0, 0, 0, 0.23)',
    },
    buttons: {
      padding: '24px 24px 12px 24px',
    },
    buttonUnselected: {
      color: '#E0E0E0',
    },
  })
);

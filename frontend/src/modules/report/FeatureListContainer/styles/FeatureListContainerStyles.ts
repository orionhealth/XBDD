import { makeStyles, createStyles } from '@material-ui/core';

export const useFeatureListItemStyles = makeStyles(() =>
  createStyles({
    tags: {
      height: '18px',
      margin: '0 2px',
      background: '#428bca',
      color: 'white',
    },
    item: {
      lineHeight: '22px',
      display: 'inline-block',
    },
    itemSelected: {
      fontWeight: 'bold',
      backgroundColor: '#E0E0E0',
    },
    listItem: {
      paddingLeft: '40px',
    },
  })
);

export const useFeatureListContainerStyles = makeStyles(() =>
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
    tagListContainer: {
      padding: '12px 24px 24px 24px',
    },
    checkedIcon: {
      color: '#7dc3ff',
      fontSize: '20px',
    },
    unCheckedIcon: {
      fontSize: '20px',
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

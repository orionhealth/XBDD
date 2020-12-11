import { makeStyles, createStyles } from '@material-ui/core';

export const useFeatureListItemStyles = makeStyles(() =>
  createStyles({
    tagViewFeatureList: {
      paddingLeft: '20px',
    },
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
    featureName: {
      paddingRight: '4px',
    },
  })
);

import { makeStyles, createStyles } from '@material-ui/core';

export const useFeatureSummaryStyles = makeStyles(() =>
  createStyles({
    featureSummary: {
      padding: '24px',
      margin: '24px 0',
    },
    featureEditInfo: {
      fontSize: '14px',
      padding: '6px 0',
    },
    featureTags: {
      padding: '6px',
    },
    featureTag: {
      size: 'small',
      margin: '2px',
      background: '#428bca',
      color: 'white',
    },
    featureTitle: {
      paddingBottom: '6px',
    },
    featureDescription: {
      overflowX: 'auto',
      textAlign: 'left',
      padding: '12px 0 12px 12px',
    },
  })
);

export const useExecutionHistoryStyles = makeStyles(() =>
  createStyles({
    executionHistory: {
      paddingTop: '12px',
    },
    executionHistoryIcon: {
      padding: '4px',
    },
    featureStatusArrow: {
      fontSize: '24px',
      color: '#999',
    },
  })
);

export const useStatusIconStyles = makeStyles(() =>
  createStyles({
    featureStatus: {
      display: 'inline-flex',
    },
    bigIcons: {
      fontSize: '24px',
    },
    smallIcons: {
      fontSize: '17px',
    },
    featureStatusArrow: {
      color: '#999',
    },
  })
);

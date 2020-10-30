import { makeStyles, createStyles } from '@material-ui/core';

export const useStepStyles = makeStyles(() =>
  createStyles({
    stepIconBox: {
      padding: '3px',
    },
    stepContentBox: {
      padding: '3px',
      overflowX: 'scroll',
    },
    skippedStepText: {
      textDecoration: 'line-through',
    },
    steps: {
      paddingBottom: '12px',
    },
    step: {
      display: 'block',
      padding: '0',
    },
    stepTitle: {
      fontWeight: 'bold',
    },
    stepKeyword: {
      color: '#07584F',
    },
    scenarioStepIcon: {
      fontSize: '16px',
    },
    scenarioStepStatusPassed: {
      color: '#576E5D',
    },
    scenarioStepStatusFailed: {
      color: '#AC534F',
    },
    scenarioStepStatusSkipped: {
      color: '#457B9D',
    },
  })
);

export const useInputFieldStyles = makeStyles(() =>
  createStyles({
    inputField: {
      margin: '0',
    },
  })
);

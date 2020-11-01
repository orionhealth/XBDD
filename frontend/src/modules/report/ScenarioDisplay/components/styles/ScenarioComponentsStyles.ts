import { makeStyles, createStyles } from '@material-ui/core';

export const useStepsStyles = makeStyles(() =>
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
  })
);

export const useInputFieldStyles = makeStyles(() =>
  createStyles({
    inputField: {
      margin: '0',
    },
  })
);

export const useCucumberTableStyles = makeStyles(() =>
  createStyles({
    scrollableTable: {
      overflowX: 'scroll',
    },
    stepTable: {
      width: 'auto',
      margin: '4px 0 12px 0',
    },
  })
);

export const usePopperMenuStyles = makeStyles(() =>
  createStyles({
    scenarioStepIcon: {
      fontSize: '16px',
    },
    moreButton: {
      padding: '0px',
    },
    popperMenu: {
      zIndex: 999,
    },
  })
);

export const useSceenshotStyles = makeStyles(() =>
  createStyles({
    screenshot: {
      margin: '20px 0 0 24px',
      border: '1px solid rgba(0, 0, 0, 0.23)',
      height: '50%',
      width: '50%',
    },
  })
);

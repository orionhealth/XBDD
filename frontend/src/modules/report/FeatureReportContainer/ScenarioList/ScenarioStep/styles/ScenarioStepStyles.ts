import { createStyles } from '@material-ui/core';

const stepStyles = createStyles({
  stepIconBox: {
    padding: '3px',
  },
  stepContentBox: {
    padding: '3px',
    overflowX: 'scroll',
  },
  screenshot: {
    margin: '20px 0 0 24px',
    border: '1px solid rgba(0, 0, 0, 0.23)',
    height: '50%',
    width: '50%',
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
    color: 'white',
  },
  stepIconFailed: {
    backgroundColor: '#AC534F',
  },
});

const inputFieldStyles = createStyles({
  inputField: {
    margin: '0',
  },
});

export { stepStyles, inputFieldStyles };

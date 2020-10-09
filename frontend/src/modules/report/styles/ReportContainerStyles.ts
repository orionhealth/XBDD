import { createStyles } from '@material-ui/core';

const reportContainerStyles = createStyles({
  scenarioList: {
    padding: '0 24px 24px 12px',
    position: 'fixed',
    right: '0',
    left: '34%'
  },
  scenarioBody: {
    overflow: 'scroll',
    height: '500px',
    boxShadow: 'none',
  },
});

export { reportContainerStyles };

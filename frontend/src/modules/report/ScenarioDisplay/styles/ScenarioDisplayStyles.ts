import { createStyles, makeStyles } from '@material-ui/core';

const useScenarioDisplayStyles = makeStyles(() =>
  createStyles({
    scenarioListItem: {
      textAlign: 'left',
      boxShadow: '0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12)',
    },
    expandedScenarioTitle: {
      fontWeight: 'bold',
      fontSize: '18px',
    },
    xbddScenarioPassed: {
      color: '#576E5D',
    },
    xbddScenarioFailed: {
      color: '#AC534F',
    },
    xbddScenarioUndefined: {
      color: '#C39575',
    },
    xbddScenarioSkipped: {
      color: '#457B9D',
    },
    buttons: {
      textAlign: 'right',
      marginTop: '12px',
    },
    skipAllSteps: {
      margin: '4px',
      color: 'white',
      backgroundColor: '#457B9D',
    },
    passAllSteps: {
      margin: '4px',
      color: 'white',
      backgroundColor: '#576E5D',
    },
    submitButton: {
      margin: '4px',
      color: 'white',
      backgroundColor: '#dc004e',
    },
    statusIconsBox: {
      padding: '0px 8px 0px 0px',
    },
    scenarioTitleBox: {
      padding: '0px',
    },
  })
);

export default useScenarioDisplayStyles;

const scenarioListStyles = {
  scenarioList: {
    padding: "0 24px 24px 12px",
  },
  scenarioListItem: {
    textAlign: "left",
    boxShadow: "0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12)",
  },
  expandedScenarioTitle: {
    fontWeight: "bold",
    fontSize: "18px",
  },
  xbddScenarioPassed: {
    color: "#576E5D",
  },
  xbddScenarioFailed: {
    color: "#AC534F",
  },
  xbddScenarioUndefined: {
    color: "#C39575",
  },
  xbddScenarioSkipped: {
    color: "#457B9D",
  },
  buttons: {
    textAlign: "right",
    marginTop: "12px",
  },
  skipAllSteps: {
    margin: "4px",
    color: "white",
    backgroundColor: "#457B9D",
  },
  passAllSteps: {
    margin: "4px",
    color: "white",
    backgroundColor: "#576E5D",
  },
  submitButton: {
    margin: "4px",
    color: "white",
    backgroundColor: "#dc004e",
  },
};

const stepStyles = {
  stepIconBox: {
    padding: "3px",
  },
  stepContentBox: {
    padding: "3px",
    overflowX: "scroll",
  },
  steps: {
    paddingBottom: "12px",
  },
  step: {
    display: "block",
    padding: "0",
  },
  stepTitle: {
    fontWeight: "bold",
  },
  stepKeyword: {
    color: "#07584F",
  },
  scrollableTable: {
    overflowX: "scroll",
  },
  stepTable: {
    width: "auto",
    margin: "4px 0 12px 0",
  },
  scenarioStepIcon: {
    fontSize: "16px",
  },
  scenarioStepStatusPassed: {
    color: "#576E5D",
  },
  scenarioStepStatusFailed: {
    color: "white",
  },
  moreButton: {
    padding: "0px",
  },
  popperMenu: {
    zIndex: "999",
  },
  stepIconFailed: {
    backgroundColor: "#AC534F",
  },
};

const inputFielsStyles = {
  inputField: {
    margin: "0",
  },
};

export { scenarioListStyles, stepStyles, inputFielsStyles };

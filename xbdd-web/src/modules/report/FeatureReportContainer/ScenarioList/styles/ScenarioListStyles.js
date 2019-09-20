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

  // xbddFilterButtons: {
  //   padding: "24px 24px 12px 24px",
  // },
  // xbddFilterButton: {
  //   height: "calc(100% - 4px)",
  //   marginTop: "2px",
  //   marginBottom: "2px",
  //   borderRadius: 0,
  //   width: "25%",
  //   borderRight: "1px solid rgba(0, 0, 0, 0.23)",
  // },
  // xbddFilterButtonUnselected: {
  //   color: "#E0E0E0",
  // },
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
  stepTable: {
    margin: "4px 0 12px 0",
    overflowX: "scroll",
  },
  scenarioStepIcon: {
    fontSize: "18px",
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

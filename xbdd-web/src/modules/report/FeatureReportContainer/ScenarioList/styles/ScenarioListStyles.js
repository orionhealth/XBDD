const scenarioListStyles = {
  scenarioList: {
    padding: "0 24px 24px 12px",
  },
  scenarioListItem: {
    boxShadow: "0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12)",
  },
  buttons: {
    textAlign: "right",
    marginTop: "12px",
  },
  cancelButton: {
    margin: "4px",
    color: "white",
    backgroundColor: "#1976d2",
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
  // xbddFilterButtonPassed: {
  //   color: "#576E5D",
  // },
  // xbddFilterButtonFailed: {
  //   color: "#AC534F",
  // },
  // xbddFilterButtonUndefined: {
  //   color: "#C39575",
  // },
  // xbddFilterButtonSkipped: {
  //   color: "#457B9D",
  //   borderRight: "hidden",
  // },
  // xbddFilterButtonUnselected: {
  //   color: "#E0E0E0",
  // },
};

const stepStyles = {
  steps: {
    paddingBottom: "12px",
    overflowX: "scroll",
  },
  step: {
    display: "contents",
  },
  stepTitle: {
    fontWeight: "bold",
  },
  stepKeyword: {
    color: "green",
  },
};

const inputFielsStyles = {
  inputField: {
    margin: 0,
  },
};

export { scenarioListStyles, stepStyles, inputFielsStyles };

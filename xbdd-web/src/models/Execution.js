class Execution {
  constructor(data) {
    this.build = data.build;
    this.calculatedStatus = data.calculatedStatus;
    this.originalAutomatedStatus = data.originalAutomatedStatus;
    this.statusLastEditedBy = data.statusLastEditedBy;
  }
}

export default Execution;

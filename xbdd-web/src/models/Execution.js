class Execution {
  constructor(build) {
    this.buildName = build.build;
    this.calculatedStatus = build.calculatedStatus;
    this.originalAutomatedStatus = build.originalAutomatedStatus;
    this.statusLastEditedBy = build.statusLastEditedBy;
  }
}

export default Execution;

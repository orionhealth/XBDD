class Execution {
  constructor(data) {
    this.build = data.build;
    this.calculatedStatus = data.calculatedStatus;
    this.originalAutomatedStatus = data.originalAutomatedStatus;
    this.statusLastEditedBy = data.statusLastEditedBy;
  }

  clone() {
    return new Execution(this);
  }
}

export default Execution;

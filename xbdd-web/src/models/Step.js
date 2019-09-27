class Step {
  constructor(data) {
    if (data) {
      this.id = data.line;
      this.keyword = data.keyword;
      this.name = data.name;
      this.status = data.result.status ? data.result.status : null;
      this.manualStatus = data.result.manualStatus ? data.result.manualStatus : null;
      this.rows = data.rows;
      this.embeddings = data.embeddings;
    }
  }

  clone() {
    const cloneStep = new Step();
    cloneStep.id = this.id;
    cloneStep.keyword = this.keyword;
    cloneStep.name = this.name;
    cloneStep.status = this.status;
    cloneStep.manualStatus = this.manualStatus;
    cloneStep.rows = this.rows;
    cloneStep.embeddings = this.embeddings;
    return cloneStep;
  }
}

export default Step;

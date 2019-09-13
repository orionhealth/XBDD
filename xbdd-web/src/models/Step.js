class Step {
  constructor(data) {
    this.id = data.line;
    this.keyword = data.keyword;
    this.name = data.name;
    this.manualStatus = data.result.manualStatus ? data.result.manualStatus : null;
    this.status = data.result.status;
  }
}

export default Step;

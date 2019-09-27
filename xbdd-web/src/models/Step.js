class Step {
  constructor(data) {
    this.id = data.line;
    this.keyword = data.keyword;
    this.name = data.name;
    this.status = data.result.status;
    this.manualStatus = data.result.manualStatus ? data.result.manualStatus : null;
    this.rows = data.rows ? data.rows : null;
    this.embeddings = data.embeddings ? data.embeddings : null;
  }
}

export default Step;

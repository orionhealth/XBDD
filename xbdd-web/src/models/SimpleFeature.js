class SimpleFeature {
  constructor(data) {
    this.id = data.id;
    this._id = data._id;
    this.name = data.name;
    this.calculatedStatus = data.calculatedStatus;
    this.originalAutomatedStatus = data.originalAutomatedStatus ? data.originalAutomatedStatus : null;
    this.tags = data.tags;
  }
}

export default SimpleFeature;

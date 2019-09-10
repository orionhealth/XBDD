class SimpleFeature {
  constructor(data) {
    this.id = data._id;
    this.name = data.name;
    this.calculatedStatus = data.calculatedStatus;
    this.originalAutomatedStatus = data.originalAutomatedStatus ? data.originalAutomatedStatus : null;
    this.tags = data.tags ? data.tags : null;
  }
}

export default SimpleFeature;

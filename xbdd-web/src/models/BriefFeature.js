class BriefFeature {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.calculatedStatus = data.calculatedStatus;
    this.originalAutomatedStatus = data.originalAutomatedStatus;
    this.tags = data.tags;
    this.restId = data["_id"];
  }
}

export default BriefFeature;

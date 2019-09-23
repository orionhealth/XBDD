import Scenario from "./Scenario";

class Feature {
  constructor(data) {
    if (data) {
      this.id = data.id;
      this._id = data._id;
      this.name = data.name;
      this.description = data.description;
      this.keyword = data.keyword;
      this.calculatedStatus = data.calculatedStatus;
      this.originalAutomatedStatus = data.originalAutomatedStatus;
      this.tags = data.tags;
      this.scenarios = data.elements.map(element => new Scenario(element));
    }
  }

  clone(feature) {
    this.id = feature.id;
    this._id = feature._id;
    this.name = feature.name;
    this.description = feature.description;
    this.keyword = feature.keyword;
    this.calculatedStatus = feature.calculatedStatus;
    this.originalAutomatedStatus = feature.originalAutomatedStatus;
    this.tags = feature.tags;
    this.scenarios = feature.scenarios;
    return this;
  }

  calculateStatus() {
    var status = "passed";
    if (this.scenarios) {
      this.calculatedStatus = this.scenarios.forEach(scenario => {
        if (scenario.calculatedStatus === "failed") {
          status = "failed";
        } else if (scenario.calculatedStatus === "undefined" && status !== "failed") {
          status = "undefined";
        } else if (scenario.calculatedStatus === "skipped" && status === "passed") {
          status = "skipped";
        }
      });
    }
    this.calculatedStatus = status;
  }
}

export default Feature;

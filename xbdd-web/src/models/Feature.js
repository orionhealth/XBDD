import Scenario from "./Scenario";

class Feature {
  constructor(feature) {
    this.id = feature.id;
    this._id = feature._id;
    this.name = feature.name;
    this.description = feature.description;
    this.keyword = feature.keyword;
    this.calculatedStatus = feature.calculatedStatus;
    this.originalAutomatedStatus = feature.originalAutomatedStatus;
    this.tags = feature.tags;
    this.scenarios = feature.elements.map(element => new Scenario(element));
  }

  calculateStatus() {
    var status = "passed";
    if (this.scenarios) {
      this.calculatedStatus = this.scenarios.forEach(scenario => {
        if (scenario.calculatedStatus === "failed") {
          status = "failed";
        } else if (scenario.calculatedStatus === "undefined" && this.calculatedStatus !== "failed") {
          status = "undefined";
        } else if (scenario.calculatedStatus === "skipped" && this.calculatedStatus !== "failed" && this.calculatedStatus !== "undefined") {
          status = "skipped";
        }
      });
    }
    this.calculatedStatus = status;
  }
}

export default Feature;

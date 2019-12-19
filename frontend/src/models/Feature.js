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

  clone() {
    const cloneFeature = new Feature();
    cloneFeature.id = this.id;
    cloneFeature._id = this._id;
    cloneFeature.name = this.name;
    cloneFeature.description = this.description;
    cloneFeature.keyword = this.keyword;
    cloneFeature.originalAutomatedStatus = this.originalAutomatedStatus;
    cloneFeature.calculatedStatus = this.calculatedStatus;
    cloneFeature.tags = this.tags;
    cloneFeature.scenarios = this.scenarios.map(scenario => scenario.clone());
    return cloneFeature;
  }

  calculateStatus() {
    const statuses = {};

    if (this.scenarios) {
      this.scenarios.forEach(scenario => {
        if (scenario.calculatedStatus) {
          statuses[scenario.calculatedStatus] = scenario.calculatedStatus;
        } else {
          statuses[scenario.originalAutomatedStatus] = scenario.originalAutomatedStatus;
        }
      });
    }

    this.calculatedStatus = statuses.failed || statuses.undefined || statuses.skipped || statuses.passed;
  }
}

export default Feature;

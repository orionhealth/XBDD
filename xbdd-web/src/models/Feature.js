import Scenario from "./Scenario";

export default class Feature {
  constructor(feature) {
    this.id = feature._id;
    this.name = feature.name;
    this.description = feature.description;
    this.keyword = feature.keyword;
    this.calculatedStatus = feature.calculatedStatus;
    this.originalAutomatedStatus = feature.originalAutomatedStatus;
    this.tags = feature.tags;
    this.scenarios = feature.elements.map(element => new Scenario(element));
  }
}

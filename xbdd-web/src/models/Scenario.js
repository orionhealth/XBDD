export default class Scenario {
  constructor(scenario) {
    this.id = scenario.id;
    this.name = scenario.name;
    this.background = scenario.background;
    this.steps = scenario.steps;
  }
}

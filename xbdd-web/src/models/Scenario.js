import Step from "./Step";

class Scenario {
  constructor(scenario) {
    this.id = scenario.id;
    this.name = scenario.name;
    this.backgroundSteps = scenario.background ? scenario.background.steps.map(step => new Step(step)) : null;
    this.steps = scenario.steps ? scenario.steps.map(step => new Step(step)) : null;
    this.environmentNotes = scenario["environment-notes"] ? scenario["environment-notes"] : null;
    this.executionNotes = scenario["execution-notes"] ? scenario["execution-notes"] : null;
    this.testingTips = scenario["testing-tips"] ? scenario["testing-tips"] : null;
  }
}

export default Scenario;

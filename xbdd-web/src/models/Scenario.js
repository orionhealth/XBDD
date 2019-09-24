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
    this.calculateStatus();
  }

  calculateStatus() {
    if (this.backgroundSteps) {
      const notPassedBgStep = this.backgroundSteps.find(step =>
        step.manualStatus ? step.manualStatus !== "passed" : step.status !== "passed");
      if (notPassedBgStep) {
        this.calculatedStatus = notPassedBgStep.manualStatus ? notPassedBgStep.manualStatus : notPassedBgStep.status;
        return;
      }
    }
    if (this.steps) {
      const notPassedStep = this.steps.find(step => (step.manualStatus ? step.manualStatus !== "passed" : step.status !== "passed"));
      if (notPassedStep) {
        this.calculatedStatus = notPassedStep.manualStatus ? notPassedStep.manualStatus : notPassedStep.status;
        return;
      }
    }
    this.calculatedStatus = "passed";
  }
}

export default Scenario;

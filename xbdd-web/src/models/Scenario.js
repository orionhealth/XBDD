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
      const calculatedBackgroundStatus = this.backgroundSteps.find(step => {
        if (step.manualStatus) {
          return step.manualStatus !== "passed";
        } else {
          return step.status !== "passed";
        }
      });
      if (calculatedBackgroundStatus) {
        this.calculatedStatus = calculatedBackgroundStatus.manualStatus
          ? calculatedBackgroundStatus.manualStatus
          : calculatedBackgroundStatus.status;
        return;
      }
    }
    if (this.steps) {
      const calculatedStatus = this.steps.find(step => {
        if (step.manualStatus) {
          return step.manualStatus !== "passed";
        } else {
          return step.status !== "passed";
        }
      });
      if (calculatedStatus) {
        this.calculatedStatus = calculatedStatus.manualStatus ? calculatedStatus.manualStatus : calculatedStatus.status;
        return;
      }
    }
    this.calculatedStatus = "passed";
  }
}

export default Scenario;

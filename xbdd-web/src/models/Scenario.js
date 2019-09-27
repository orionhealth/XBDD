import Step from "./Step";

class Scenario {
  constructor(scenario) {
    if (scenario) {
      this.id = scenario.id;
      this.name = scenario.name;
      this.backgroundSteps = scenario.background ? scenario.background.steps.map(step => new Step(step)) : null;
      this.steps = scenario.steps ? scenario.steps.map(step => new Step(step)) : null;
      this.environmentNotes = scenario["environment-notes"];
      this.executionNotes = scenario["execution-notes"];
      this.testingTips = scenario["testing-tips"];
      this.calculateStatus();
    }
  }

  clone() {
    const cloneScenario = new Scenario();
    cloneScenario.id = this.id;
    cloneScenario.name = this.name;
    cloneScenario.backgroundSteps = this.backgroundSteps ? this.backgroundSteps.map(step => step.clone()) : null;
    cloneScenario.steps = this.steps ? this.steps.map(step => step.clone()) : null;
    cloneScenario.environmentNotes = this.environmentNotes;
    cloneScenario.executionNotes = this.executionNotes;
    cloneScenario.testingTips = this.testingTips;
    cloneScenario.calculatedStatus = this.calculatedStatus;
    return cloneScenario;
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

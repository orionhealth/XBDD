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
      this.originalAutomatedStatus = this.calculateAutoStatus();
      this.calculatedStatus = this.calculateManualStatus();
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
    cloneScenario.originalAutomatedStatus = this.originalAutomatedStatus;
    cloneScenario.calculatedStatus = this.calculatedStatus;
    return cloneScenario;
  }

  calculateManualStatus() {
    if (this.backgroundSteps) {
      const notPassedBgStep = this.backgroundSteps.find(step =>
        step.manualStatus ? step.manualStatus !== "passed" : step.status !== "passed");
      if (notPassedBgStep) {
        return notPassedBgStep.manualStatus ? notPassedBgStep.manualStatus : notPassedBgStep.status;
      }
    }
    if (this.steps) {
      const notPassedStep = this.steps.find(step => (step.manualStatus ? step.manualStatus !== "passed" : step.status !== "passed"));
      if (notPassedStep) {
        return notPassedStep.manualStatus ? notPassedStep.manualStatus : notPassedStep.status;
      }
    }
    return "passed";
  }

  calculateAutoStatus() {
    if (this.backgroundSteps) {
      const notPassedBgStep = this.backgroundSteps.find(step => step.status !== "passed");
      if (notPassedBgStep) {
        return notPassedBgStep.status;
      }
    }
    if (this.steps) {
      const notPassedStep = this.steps.find(step => step.status !== "passed");
      if (notPassedStep) {
        return notPassedStep.status;
      }
    }
    return "passed";
  }
}

export default Scenario;

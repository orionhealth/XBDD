import Scenario from 'models/Scenario';
import Status from 'models/Status';

export function calculateManualStatus(scenario: Scenario): Status {
  if (scenario.backgroundSteps) {
    const notPassedBgStep = scenario.backgroundSteps.find(step =>
      step.manualStatus ? step.manualStatus !== Status.Passed : step.status !== Status.Passed
    );
    if (notPassedBgStep) {
      return notPassedBgStep.manualStatus ? notPassedBgStep.manualStatus : notPassedBgStep.status;
    }
  }
  if (scenario.steps) {
    const notPassedStep = scenario.steps.find(step =>
      step.manualStatus ? step.manualStatus !== Status.Passed : step.status !== Status.Passed
    );
    if (notPassedStep) {
      return notPassedStep.manualStatus ? notPassedStep.manualStatus : notPassedStep.status;
    }
  }
  return Status.Passed;
}

// TODO - this function isn't used - is it needed?
export function calculateAutoStatus(scenario: Scenario): Status {
  if (scenario.backgroundSteps) {
    const notPassedBgStep = scenario.backgroundSteps.find(step => step.status !== Status.Passed);
    if (notPassedBgStep) {
      return notPassedBgStep.status;
    }
  }
  if (scenario.steps) {
    const notPassedStep = scenario.steps.find(step => step.status !== Status.Passed);
    if (notPassedStep) {
      return notPassedStep.status;
    }
  }
  return Status.Passed;
}

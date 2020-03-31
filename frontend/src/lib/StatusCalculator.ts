import Status from 'models/Status';
import Step from 'models/Step';
import Feature from 'models/Feature';

type ScenarioDetails = {
  backgroundSteps: Step[];
  steps: Step[];
};

const STATUS_PRIORITY_ORDER = [Status.Failed, Status.Undefined, Status.Skipped, Status.Passed];
export const calculateFeatureStatus = (feature: Feature): Status => {
  const scenarioStatuses = feature.scenarios.map(scenario => scenario.calculatedStatus || scenario.originalAutomatedStatus);
  const featureStatus = STATUS_PRIORITY_ORDER.find(status => scenarioStatuses.includes(status));
  if (featureStatus) {
    return featureStatus;
  }
  return Status.Passed;
};

const calculateStatus = (scenario: ScenarioDetails, getStepStatus: (step: Step) => Status): Status => {
  const statuses: Status[] = [];
  statuses.push(...scenario.backgroundSteps.map(getStepStatus));
  statuses.push(...scenario.steps.map(getStepStatus));
  statuses.sort((status1, status2) => STATUS_PRIORITY_ORDER.indexOf(status1) - STATUS_PRIORITY_ORDER.indexOf(status2));
  if (statuses.length > 0) {
    return statuses[0];
  }
  return Status.Passed;
};

export const calculateManualStatus = (scenario: ScenarioDetails): Status =>
  calculateStatus(scenario, step => step.manualStatus || step.status);
export const calculateAutoStatus = (scenario: ScenarioDetails): Status => calculateStatus(scenario, step => step.status);

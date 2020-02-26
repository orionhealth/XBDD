import Step, { createStepFromFetchedData } from './Step';
import Status from './Status';
import { calculateManualStatus, calculateAutoStatus } from '../lib/ScenarioStatusCalculator';

interface Scenario {
  id: string;
  name: string;
  backgroundSteps: Step[];
  steps: Step[];
  environmentNotes: string;
  executionNotes: string;
  testingTips: string;
  originalAutomatedStatus: Status;
  calculatedStatus: Status;
}

const createScenarioFromFetchedData = (data: any): Scenario => {
  const scenarioBase = {
    id: data.id,
    name: data.name,
    backgroundSteps: data.background ? data.background.steps.map((step: any) => createStepFromFetchedData(step)) : [],
    steps: data.steps ? data.steps.map(step => createStepFromFetchedData(step)) : [],
    environmentNotes: data['environment-notes'],
    executionNotes: data['execution-notes'],
    testingTips: data['testing-tips'],
  };
  return {
    ...scenarioBase,
    originalAutomatedStatus: calculateAutoStatus(scenarioBase),
    calculatedStatus: calculateManualStatus(scenarioBase),
  };
};

// TODO - once we move the state to redux and use createSlice and immer, we won't need these clone methods as we can mutate state directly.
const cloneScenario = (scenario: Scenario): Scenario => {
  return {
    id: scenario.id,
    name: scenario.name,
    backgroundSteps: scenario.backgroundSteps.map(step => ({ ...step })),
    steps: scenario.steps.map(step => ({ ...step })),
    environmentNotes: scenario.environmentNotes,
    executionNotes: scenario.executionNotes,
    testingTips: scenario.testingTips,
    originalAutomatedStatus: scenario.originalAutomatedStatus,
    calculatedStatus: scenario.calculatedStatus,
  };
};

export { createScenarioFromFetchedData, cloneScenario };
export default Scenario;

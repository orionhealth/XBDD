import Status from './Status';
import Step from './Step';

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

export default Scenario;

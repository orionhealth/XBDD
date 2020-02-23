import Step from './Step';
import Status from './Status';

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

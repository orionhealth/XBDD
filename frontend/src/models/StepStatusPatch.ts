import Status from './Status';

interface StepStatusPatch {
  scenarioId: string;
  status: Status;
  line?: number;
}

export default StepStatusPatch;

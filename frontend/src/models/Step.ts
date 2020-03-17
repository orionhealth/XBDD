import Status from './Status';

export interface StepRow {
  cells: string[];
  line: string;
}

interface Step {
  id: string;
  keyword: string;
  name: string;
  status: Status;
  manualStatus: Status;
  rows: StepRow[];
  embeddings: string;
}

export default Step;

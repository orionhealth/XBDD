import Status from './Status';

export interface StepRow {
  cells: string[];
  line: number;
}

interface Step {
  id: number;
  keyword: string;
  name: string;
  status: Status;
  manualStatus?: Status;
  rows?: StepRow[];
  embeddings?: string[];
}

export default Step;

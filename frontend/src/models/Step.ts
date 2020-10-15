import Status from './Status';
import StepRow from './StepRow';

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

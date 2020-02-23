import Status from './Status';

interface Step {
  id: string;
  keyword: string;
  name: string;
  status: Status;
  manualStatus: Status;
  rows: string;
  embeddings: string;
}

export default Step;

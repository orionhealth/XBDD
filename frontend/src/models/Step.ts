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

export const createStepFromFetchedData = (data: any): Step => {
  return {
    id: data.line,
    keyword: data.keyword,
    name: data.name,
    status: data.result.status,
    manualStatus: data.result.manualStatus,
    rows: data.rows,
    embeddings: data.embeddings,
  };
};

export default Step;

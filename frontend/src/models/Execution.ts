import Status from './Status';

interface Execution {
  build: string;
  calculatedStatus: Status;
  originalAutomatedStatus: Status;
  statusLastEditedBy: string;
}

export const createExecutionFromFetchedData = (data: any): Execution => {
  return {
    build: data.build,
    calculatedStatus: data.calculatedStatus,
    originalAutomatedStatus: data.originalAutomatedStatus,
    statusLastEditedBy: data.statusLastEditedBy,
  };
};

export default Execution;

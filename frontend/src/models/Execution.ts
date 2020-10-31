import Status from './Status';

interface Execution {
  build: string;
  calculatedStatus: Status;
  originalAutomatedStatus: Status;
}

export default Execution;

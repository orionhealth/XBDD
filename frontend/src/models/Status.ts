enum Status {
  Passed = 'passed',
  Failed = 'failed',
  Skipped = 'skipped',
  Undefined = 'undefined',
}

export type StatusMap<T> = { [key in Status]: T };

export const { Passed, Failed, Skipped, Undefined } = Status;

export default Status;

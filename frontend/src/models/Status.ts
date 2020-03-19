enum Status {
  Passed = 'passed',
  Failed = 'failed',
  Skipped = 'skipped',
  Undefined = 'undefined',
}

export type StatusMap<T> = { [key in Status]: T };

export const { Passed, Failed, Skipped, Undefined } = Status;

export const getStatusFromString = (statusString: string): Status => {
  const res = Object.values(Status).find(status => status === statusString);
  if (!res) {
    throw new Error(`No Status exists for string ${statusString}`);
  }
  return res;
};

export default Status;

enum Status {
  Passed = 'passed',
  Failed = 'failed',
  Skipped = 'skipped',
  Undefined = 'undefined',
}

export type StatusMap<T> = { [key in Status]: T };

export const { Passed, Failed, Skipped, Undefined } = Status;

export const Statuses = [Passed, Failed, Skipped, Undefined];

export const getStatusFromString = (statusString: string): Status => {
  const res = Object.values(Status).find(status => status === statusString);
  if (!res) {
    return Status.Undefined;
  }
  return res;
};

export default Status;

import React from 'react';

const useAsyncError: (e: Error) => void = () => {
  const [_, setError] = React.useState();
  return React.useCallback(
    e => {
      setError(() => {
        throw e;
      });
    },
    [setError]
  );
};

export default useAsyncError;

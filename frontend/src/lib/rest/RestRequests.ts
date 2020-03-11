import { showNotification } from 'modules/notifications/notifications';
import { createCheckers, ITypeSuite } from 'ts-interface-checker';

const username = 'admin';
const password = 'password';
const backendUrl = process.env.REACT_APP_BACKEND_HOST;
const DEFAULT_TIMEOUT = 10000;

const getHeaders = (): Headers => {
  return new Headers({
    Authorization: `Basic ${btoa(`${username}:${password}`)})`,
    'Content-Type': 'application/json',
  });
};

const timeout = (promise: Promise<Response>, ms = DEFAULT_TIMEOUT): Promise<Response> => {
  const timerPromise = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(new Error('Timeout'));
    }, ms);
  });
  return Promise.race([timerPromise, promise]);
};

const handleError = (error: Error, path: string, message: string): void => {
  console.error(`${path} failed: ${error.message}`);
  showNotification({ message, severity: 'error' });
};

const makeCall = <T>(path: string, options: RequestInit): Promise<T | void> => {
  const url = `${backendUrl}${path}`;
  return timeout(fetch(url, options)).then(response => {
    if (!response.ok) {
      throw new Error(`${response.status} ${response.body}`);
    }
    if (response.status === 204) {
      return null;
    }
    return response.json();
  });
};

const doRequest = <T>(path: string, options: RequestInit, errorMessage: string): Promise<T | void> => {
  return makeCall<T>(path, options).catch(error => handleError(error, path, errorMessage));
};

const doRequestWithCallback = <T, R>(
  path: string,
  options: RequestInit,
  errorMessage: string,
  isExpectedResponse: (responseData: unknown) => boolean,
  onSuccess: (responseData: T) => R
): Promise<R | void> => {
  return makeCall<T>(path, options)
    .then((responseData: T | void) => {
      if (isExpectedResponse && !isExpectedResponse(responseData)) {
        throw new Error(`Unexpected response: ${JSON.stringify(responseData)}`);
      }
      if (!responseData) {
        throw new Error('Response data expected');
      }
      return onSuccess(responseData);
    })
    .catch(error => handleError(error, path, errorMessage));
};

export const doGetRequest = <T>(path: string, errorMessage = 'rest.error.get'): Promise<T | void> => {
  const options = {
    method: 'GET',
    headers: getHeaders(),
  };
  return doRequest(path, options, errorMessage);
};

export const doGetRequestWithCallback = <T, R>(
  path: string,
  errorMessage = 'rest.error.get',
  isExpectedResponse: (responseData: unknown) => boolean,
  onSuccess: (responseData: T) => R
): Promise<R | void> => {
  const options = {
    method: 'GET',
    headers: getHeaders(),
  };
  return doRequestWithCallback(path, options, errorMessage, isExpectedResponse, onSuccess);
};

export const doPutRequest = <T>(path: string, data: unknown, errorMessage = 'rest.error.put'): Promise<T | void> => {
  const options = {
    method: 'PUT',
    headers: getHeaders(),
    body: data ? JSON.stringify(data) : null,
  };
  return doRequest(path, options, errorMessage);
};

export const doDeleteRequest = <T>(path: string, errorMessage = 'rest.error.delete'): Promise<T | void> => {
  const options = {
    method: 'DELETE',
    headers: getHeaders(),
  };
  return doRequest(path, options, errorMessage);
};

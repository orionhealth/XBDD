import { showNotification } from 'modules/notifications/notifications';
import { createCheckers, ITypeSuite } from 'ts-interface-checker';

const username = 'admin';
const password = 'password';
const backendUrl = process.env.REACT_APP_BACKEND_HOST;
const DEFAULT_TIMEOUT = 10000;

export enum Method {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

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

const validateResponseData = (responseData: unknown, type: ITypeSuite): void => {
  createCheckers(type).ResponseData.check(responseData);
};

const call = <T>(method: Method, path: string, data: unknown): Promise<T | void> => {
  const url = `${backendUrl}${path}`;
  const options = {
    method,
    headers: getHeaders(),
    body: data ? JSON.stringify(data) : null,
  };
  return timeout(fetch(url, options)).then(response => {
    if (!response.ok) {
      throw new Error(`${response.status} ${response.body}`);
    }
    if (response.status === 204) {
      return null;
    }
    return response.text().then(text => (text ? JSON.parse(text) : response));
  });
};

const handleError = (error: Error, path: string, message: string): void => {
  console.error(`${path} failed: ${error.message}`);
  showNotification({ message, severity: 'error' });
};

export function doRequest<T>(method: Method, path: string, errorMessage: string, data: unknown): Promise<T | void>;
export function doRequest<T, R>(
  method: Method,
  path: string,
  errorMessage: string,
  data: unknown,
  type: ITypeSuite,
  onSuccess: (responseData: T) => R
): Promise<R | void>;

export function doRequest<T, R>(
  method: Method,
  path: string,
  errorMessage = `rest.error.${method.toLowerCase()}`,
  data: unknown,
  isExpectedResponse?: (responseData: T | void) => boolean,
  onSuccess?: (responseData: T) => R
): Promise<T | R | void> {
  return call<T>(method, path, data)
    .then((responseData: T | void) => {
      if (type) {
        validateResponseData(responseData, type);
      }
      if (onSuccess && responseData) {
        return onSuccess(responseData);
      }
      return responseData;
    })
    .catch(error => handleError(error, path, errorMessage));
}

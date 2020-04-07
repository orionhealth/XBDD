import { createCheckers, ITypeSuite } from 'ts-interface-checker';

import { showNotification } from 'modules/notifications/notifications';
import { getTokenFromLocalStorage } from 'lib/services/LocalStorageService';

const backendUrl = process.env.REACT_APP_BACKEND_HOST || '';
const DEFAULT_TIMEOUT = 10000;

export enum Method {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

const getHeaders = (): Headers => {
  const token = getTokenFromLocalStorage();

  if (!token) {
    throw Error("Can't make authenticated call if not logged in");
  }

  return new Headers({
    Authorization: `${token.tokenType} ${token.accessToken}`,
    'Content-Type': 'application/json',
  });
};

export const timeout = (promise: Promise<Response>, ms = DEFAULT_TIMEOUT): Promise<Response> => {
  const timerPromise = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(new Error('Timeout'));
    }, ms);
  });
  return Promise.race([timerPromise, promise]);
};

const validateResponseData = (responseData: unknown, type: ITypeSuite | ITypeSuite[]): void => {
  const types = Array.isArray(type) ? type : [type];
  createCheckers(...types).ResponseData.check(responseData);
};

const call = <T>(method: Method, path: string, data: unknown, options?: RequestInit): Promise<T | void> => {
  const url = `${backendUrl}${path}`;
  const requestOptions = options || {
    method,
    headers: getHeaders(),
    body: data ? JSON.stringify(data) : null,
  };

  return timeout(fetch(url, requestOptions)).then(response => {
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
  type: ITypeSuite | ITypeSuite[],
  onSuccess: (responseData: T) => R
): Promise<R | void>;
export function doRequest<T, R>(
  method: Method,
  path: string,
  errorMessage: string,
  data: unknown,
  type: ITypeSuite | ITypeSuite[],
  onSuccess: (responseData: T) => R,
  options: RequestInit
): Promise<R | void>;

export function doRequest<T, R>(
  method: Method,
  path: string,
  errorMessage = `rest.error.${method.toLowerCase()}`,
  data: unknown,
  type?: ITypeSuite | ITypeSuite[],
  onSuccess?: (responseData: T) => R,
  options?: RequestInit
): Promise<T | R | void> {
  return call<T>(method, path, data, options)
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

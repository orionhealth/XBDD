import { createCheckers, ITypeSuite } from 'ts-interface-checker';

import { showNotification } from 'modules/notifications/notifications';

const backendUrl = process.env.REACT_APP_BACKEND_HOST || '';
const DEFAULT_TIMEOUT = 10000;

export enum Method {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

const getHeaders = (): Headers => {
  return new Headers({
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

const call = async <T>(method: Method, path: string, data: unknown, options?: RequestInit): Promise<T | void> => {
  const url = `${backendUrl}${path}`;
  const requestOptions = options || {
    method,
    credentials: 'include', // TODO - this should be dev only
    headers: getHeaders(),
    body: data ? JSON.stringify(data) : null,
  };

  const response = await timeout(fetch(url, requestOptions));
  if (!response.ok) {
    throw new Error(`${response.status} ${response.body}`);
  }
  if (response.status === 204) {
    return;
  }
  const text = await response.text();
  return text ? JSON.parse(text) : response;
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

export async function doRequest<T, R>(
  method: Method,
  path: string,
  errorMessage = `rest.error.${method.toLowerCase()}`,
  data: unknown,
  type?: ITypeSuite | ITypeSuite[],
  onSuccess?: (responseData: T) => R
): Promise<T | R | void> {
  try {
    const response = await call<T>(method, path, data);
    if (type && response) {
      validateResponseData(response, type);
    }
    if (onSuccess && response) {
      return onSuccess(response);
    }
    return response;
  } catch (error) {
    return handleError(error, path, errorMessage);
  }
}

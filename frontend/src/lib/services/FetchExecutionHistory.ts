import { doRequest, Method } from 'lib/rest/RestRequests';
import { getStatusFromString } from 'models/Status';
import Execution from 'models/Execution';
import FetchExecutionHistoryTypes from './generated/FetchExecutionHistoryTypes';
import { getEncodedURI } from 'lib/rest/URIHelper';

interface ExecutionResponseData {
  build: string;
  calculatedStatus: string;
  originalAutomatedStatus: string;
}

interface ResponseData {
  rollup: ExecutionResponseData[];
}

const createExecution = (data: ExecutionResponseData): Execution => {
  return {
    build: data.build,
    calculatedStatus: getStatusFromString(data.calculatedStatus),
    originalAutomatedStatus: getStatusFromString(data.originalAutomatedStatus),
  };
};

const createExecutionHistory = (data: ResponseData): Execution[] => {
  return data.rollup.map(execution => execution && createExecution(execution)).filter(Boolean);
};

const fetchExecutionHistory = async (product: string, version: string, featureId: string): Promise<Execution[] | void> => {
  const url = `/rest/feature/rollup/${getEncodedURI(product, version, featureId)}`;
  return doRequest(Method.GET, url, 'rest.error.get', null, FetchExecutionHistoryTypes, createExecutionHistory);
};

export default fetchExecutionHistory;

import { doRequest, Method } from 'lib/rest/RestRequests';
import { calculateAutoStatus, calculateManualStatus } from 'lib/StatusCalculator';
import Scenario from 'models/Scenario';
import Feature from 'models/Feature';
import Step from 'models/Step';
import Status from 'models/Status';
import FetchFeatureTypes from './generated/FetchFeatureTypes';

interface StepResponseData {
  line: string;
  keyword: string;
  name: string;
  result: {
    status: Status;
    manualStatus: Status;
  };
  rows: {
    cells: string[];
    line: string;
  }[];
  embeddings: string;
}

interface ScenarioResponseData {
  id: string;
  name: string;
  background?: {
    steps: StepResponseData[];
  };
  steps: StepResponseData[];
}

interface ResponseData {
  id: string;
  _id: string;
  name: string;
  description: string;
  keyword: string;
  calculatedStatus: Status;
  originalAutomatedStatus: Status;
  statusLastEditedBy: string | null;
  lastEditOn: any;
  tags: {
    name: string;
  }[];
  elements: ScenarioResponseData[];
}

const createStep = (data: StepResponseData): Step => {
  return {
    id: data.line,
    keyword: data.keyword,
    name: data.name,
    status: data.result.status,
    manualStatus: data.result.manualStatus,
    rows: data.rows,
    embeddings: data.embeddings,
  };
};

const createScenario = (data: ScenarioResponseData): Scenario => {
  const scenarioBase = {
    id: data.id,
    name: data.name,
    backgroundSteps: data.background ? data.background.steps.map((step: StepResponseData) => createStep(step)) : [],
    steps: data.steps ? data.steps.map(step => createStep(step)) : [],
    environmentNotes: data['environment-notes'],
    executionNotes: data['execution-notes'],
    testingTips: data['testing-tips'],
  };
  return {
    ...scenarioBase,
    originalAutomatedStatus: calculateAutoStatus(scenarioBase),
    calculatedStatus: calculateManualStatus(scenarioBase),
  };
};

const createFeature = (data: ResponseData): Feature => {
  return {
    id: data.id,
    _id: data._id,
    name: data.name,
    description: data.description,
    keyword: data.keyword,
    calculatedStatus: data.calculatedStatus,
    originalAutomatedStatus: data.originalAutomatedStatus,
    tags: data.tags,
    scenarios: data.elements.map(element => createScenario(element)),
    lastEditedBy: data.statusLastEditedBy || undefined,
    lastEditedOn: data.lastEditOn?.$date && new Date(Date.parse(data.lastEditOn.$date)),
  };
};

const fetchFeature = (featureId: string): Promise<Feature | void> => {
  const url = `/feature/${featureId}`;
  return doRequest(Method.GET, url, 'rest.error.get', undefined, FetchFeatureTypes, (responseData: ResponseData) => {
    return createFeature(responseData);
  });
};

export default fetchFeature;

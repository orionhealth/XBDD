import { doRequest, Method } from 'lib/rest/RestRequests';
import { calculateAutoStatus, calculateManualStatus } from 'lib/utils/StatusCalculator';
import Scenario from 'models/Scenario';
import Feature from 'models/Feature';
import Step from 'models/Step';
import FetchFeatureTypes from './generated/FetchFeatureTypes';
import { getStatusFromString } from 'models/Status';
import { SimpleTag } from 'models/Tag';
import { getEncodedURI } from 'lib/rest/URIHelper';

interface StepResponseData {
  line: number;
  keyword: string;
  name: string;
  result: {
    status: string;
    manualStatus?: string;
  };
  rows?: {
    cells: string[];
    line: number;
  }[];
  embeddings?: string[];
}

interface SimpleTagResponseData {
  name: string;
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
  calculatedStatus: string;
  originalAutomatedStatus: string;
  statusLastEditedBy?: string | null;
  lastEditOn?: { $date: string } | string;
  tags: SimpleTagResponseData[];
  elements: ScenarioResponseData[];
}

const createStep = (data: StepResponseData): Step => {
  return {
    id: data.line,
    keyword: data.keyword,
    name: data.name,
    status: getStatusFromString(data.result.status),
    manualStatus: data.result.manualStatus ? getStatusFromString(data.result.manualStatus) : undefined,
    rows: data.rows,
    embeddings: data.embeddings,
  };
};

const createSimpleTag = (data: SimpleTagResponseData): SimpleTag => {
  return {
    name: data.name,
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

// TODO We shouldn't need this but it seems we have some varying date representations coming out of the backed.
const parseLastEditOn = (date?: { $date: string } | string): number | undefined => {
  if (typeof date === 'string') {
    return Date.parse(date);
  }

  if (typeof date?.$date === 'string') {
    return Date.parse(date.$date);
  }

  return undefined;
};

const createFeature = (data: ResponseData): Feature => {
  return {
    id: data.id,
    _id: data._id,
    name: data.name,
    description: data.description,
    keyword: data.keyword,
    calculatedStatus: getStatusFromString(data.calculatedStatus),
    originalAutomatedStatus: getStatusFromString(data.originalAutomatedStatus),
    tags: data.tags.map(tag => createSimpleTag(tag)),
    scenarios: data.elements.map(element => createScenario(element)),
    lastEditedBy: data.statusLastEditedBy || undefined,
    lastEditedOn: parseLastEditOn(data.lastEditOn),
  };
};

const fetchFeature = async (product: string, version: string, build: string, featureId: string): Promise<Feature | void> => {
  const url = `/rest/feature/${getEncodedURI(product, version, build, featureId)}`;
  return doRequest(Method.GET, url, 'rest.error.get', null, FetchFeatureTypes, createFeature);
};

export default fetchFeature;

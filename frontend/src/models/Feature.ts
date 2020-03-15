import Scenario, { createScenarioFromFetchedData, cloneScenario } from './Scenario';
import Status from './Status';
import Tag from './Tag';

interface Feature {
  id: string;
  _id: string;
  name: string;
  description: string;
  keyword: string;
  calculatedStatus: Status;
  originalAutomatedStatus: Status;
  tags: Tag[];
  scenarios: Scenario[];
  lastEditedOn?: Date;
  lastEditedBy?: string;
}

export const createFeatureFromFetchedData = (data: any): Feature => {
  return {
    id: data.id,
    _id: data._id,
    name: data.name,
    description: data.description,
    keyword: data.keyword,
    calculatedStatus: data.calculatedStatus,
    originalAutomatedStatus: data.originalAutomatedStatus,
    tags: data.tags,
    scenarios: data.elements.map(element => createScenarioFromFetchedData(element)),
    lastEditedBy: data.statusLastEditedBy || undefined,
    lastEditedOn: data.lastEditOn?.$date && new Date(Date.parse(data.lastEditOn.$date)),
  };
};

export const cloneFeature = (feature: Feature): Feature => {
  return {
    id: feature.id,
    _id: feature._id,
    name: feature.name,
    description: feature.description,
    keyword: feature.keyword,
    originalAutomatedStatus: feature.originalAutomatedStatus,
    calculatedStatus: feature.calculatedStatus,
    tags: feature.tags,
    scenarios: feature.scenarios.map(scenario => cloneScenario(scenario)),
    lastEditedBy: feature.lastEditedBy,
    lastEditedOn: feature.lastEditedOn,
  };
};

export default Feature;

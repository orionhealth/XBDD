import Scenario, { cloneScenario } from './Scenario';
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

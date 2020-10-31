import Scenario from './Scenario';
import Status from './Status';
import { SimpleTag } from './Tag';

export interface SimpleFeature {
  id: string;
  _id: string;
  name: string;
  tags: SimpleTag[];
  calculatedStatus: Status;
}
interface Feature extends SimpleFeature {
  description: string;
  keyword: string;
  originalAutomatedStatus: Status;
  scenarios: Scenario[];
  lastEditedOn?: number;
  lastEditedBy?: string;
}

export default Feature;

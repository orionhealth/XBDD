import Scenario from './Scenario';
import Status from './Status';
import { SimpleTag } from './Tag';

interface Feature {
  id: string;
  _id: string;
  name: string;
  description: string;
  keyword: string;
  calculatedStatus: Status;
  originalAutomatedStatus: Status;
  tags: SimpleTag[];
  scenarios: Scenario[];
  lastEditedOn?: Date;
  lastEditedBy?: string;
}

export default Feature;

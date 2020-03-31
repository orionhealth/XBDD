import Status from './Status';
import { SimpleTag } from './Tag';

interface SimpleFeature {
  id: string;
  _id: string;
  name: string;
  tags: SimpleTag[];
  calculatedStatus: Status;
}

export default SimpleFeature;

import Status from './Status';
import Tag from './Tag';

interface SimpleFeature {
  id: string;
  _id: string;
  name: string;
  tags: Tag[];
  calculatedStatus: Status;
}

export const createSimpleFeatureFromFetchedData = (data: any): SimpleFeature => {
  return {
    id: data.id,
    _id: data._id,
    name: data.name,
    tags: data.tags,
    calculatedStatus: data.calculatedStatus,
  };
};

export const cloneSimpleFeature = (simpleFeature: SimpleFeature): SimpleFeature => {
  return {
    id: simpleFeature.id,
    _id: simpleFeature._id,
    name: simpleFeature.name,
    tags: simpleFeature.tags,
    calculatedStatus: simpleFeature.calculatedStatus,
  };
};

export default SimpleFeature;

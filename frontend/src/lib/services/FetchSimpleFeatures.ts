import { doRequest, Method } from 'lib/rest/RestRequests';
import { SimpleFeature } from 'models/Feature';
import { SimpleTag } from 'models/Tag';
import { getStatusFromString } from 'models/Status';
import FetchSimpleFeaturesTypes from './generated/FetchSimpleFeaturesTypes';

export interface SimpleFeatureResponseData {
  id: string;
  _id: string;
  name: string;
  tags: SimpleTag[];
  calculatedStatus: string;
}
type ResponseData = SimpleFeatureResponseData[];

export const createSimpleFeatures = (data: SimpleFeatureResponseData[]): SimpleFeature[] => {
  return data.map(item => ({
    ...item,
    tags: item.tags.map(tag => ({
      name: tag.name,
    })),
    calculatedStatus: getStatusFromString(item.calculatedStatus),
  }));
};

const fetchSimpleFeatures = async (product: string, version: string, build: string): Promise<SimpleFeature[] | void> => {
  const url = `/rest/reports/featureIndex/${product}/${version}/${build}`;
  return doRequest(Method.GET, url, 'rest.error.get', null, FetchSimpleFeaturesTypes, createSimpleFeatures);
};

export default fetchSimpleFeatures;

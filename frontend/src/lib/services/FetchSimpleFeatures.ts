import { doRequest, Method } from 'lib/rest/RestRequests';
import { SimpleFeature } from 'models/Feature';
import { SimpleTag } from 'models/Tag';
import { getStatusFromString } from 'models/Status';
import FetchSimpleFeaturesTypes from './generated/FetchSimpleFeaturesTypes';
import { getEncodedURI } from 'lib/rest/URIHelper';

export interface SimpleFeatureResponseData {
  id: string;
  _id: string;
  name: string;
  tags: SimpleTagResponseData[];
  calculatedStatus: string;
}

interface SimpleTagResponseData {
  name: string;
}

type ResponseData = SimpleFeatureResponseData[];

const createSimpleTag = (data: SimpleTagResponseData): SimpleTag => {
  return { name: data.name };
};

export const createSimpleFeatures = (data: ResponseData): SimpleFeature[] => {
  return data.map(item => ({
    ...item,
    tags: item.tags.map(tag => createSimpleTag(tag)),
    calculatedStatus: getStatusFromString(item.calculatedStatus),
  }));
};

const fetchSimpleFeatures = async (product: string, version: string, build: string): Promise<SimpleFeature[] | void> => {
  const url = `/rest/reports/featureIndex/${getEncodedURI(product, version, build)}`;
  return doRequest(Method.GET, url, 'rest.error.get', null, FetchSimpleFeaturesTypes, createSimpleFeatures);
};

export default fetchSimpleFeatures;

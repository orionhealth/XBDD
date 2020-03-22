import { doRequest, Method } from 'lib/rest/RestRequests';
import SimpleFeature from 'models/SimpleFeature';
import Status, { getStatusFromString } from 'models/Status';
import FetchSimpleFeaturesTypes from './generated/FetchSimpleFeaturesTypes';

export interface SimplefeatureResponseData {
  id: string;
  _id: string;
  name: string;
  tags: {
    name: string;
  }[];
  calculatedStatus: Status;
}
type ResponseData = SimplefeatureResponseData[];

export const createSimpleFeatures = (data: SimplefeatureResponseData[]): SimpleFeature[] => {
  return data.map(item => ({
    ...item,
    tags: item.tags.map(tag => ({
      name: tag.name,
    })),
    calculatedStatus: getStatusFromString(item.calculatedStatus),
  }));
};

const fetchSimpleFeatures = (product: string, version: string, build: string): Promise<SimpleFeature[] | void> => {
  const url = `/reports/featureIndex/${product}/${version}/${build}`;
  return doRequest(Method.GET, url, 'rest.error.get', null, FetchSimpleFeaturesTypes, (responseData: ResponseData) => {
    return createSimpleFeatures(responseData);
  });
};

export default fetchSimpleFeatures;

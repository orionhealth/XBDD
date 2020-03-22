import { doRequest, Method } from 'lib/rest/RestRequests';
import FetchFeatureTypes from './generated/FetchFeatureTypes';
import Tag from 'models/Tag';
import { createSimpleFeatures, SimplefeatureResponseData } from './FetchSimpleFeatures';

interface ResponseDataElement {
  tag: string;
  features: SimplefeatureResponseData[];
}
type ResponseData = ResponseDataElement[];

const createTag = (data: ResponseDataElement): Tag => {
  return {
    name: data.tag,
    features: createSimpleFeatures(data.features),
  };
};

const createTagViewData = (data: ResponseData): Tag[] => {
  return data.map(item => createTag(item));
};

const fetchSimpleFeaturesByTags = (product: string, version: string, build: string): Promise<Tag[] | void> => {
  const url = `/tagview/featureTagIndex/${product}/${version}/${build}`;
  return doRequest(Method.GET, url, 'rest.error.featuresByTag', null, FetchFeatureTypes, (responseData: ResponseData) => {
    return createTagViewData(responseData);
  });
};

export default fetchSimpleFeaturesByTags;

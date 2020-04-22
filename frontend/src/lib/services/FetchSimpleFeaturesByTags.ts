import { doRequest, Method } from 'lib/rest/RestRequests';
import FetchSimpleFeaturesByTagsTypes from './generated/FetchSimpleFeaturesByTagsTypes';
import FetchSimpleFeaturesTypes from './generated/FetchSimpleFeaturesTypes';
import Tag from 'models/Tag';
import { createSimpleFeatures, SimpleFeatureResponseData } from './FetchSimpleFeatures';

interface ResponseDataElement {
  tag: string;
  features: SimpleFeatureResponseData[];
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

const fetchSimpleFeaturesByTags = async (product: string, version: string, build: string): Promise<Tag[] | void> => {
  const url = `/rest/tagview/featureTagIndex/${product}/${version}/${build}`;
  return doRequest(
    Method.GET,
    url,
    'rest.error.featuresByTag',
    null,
    [FetchSimpleFeaturesTypes, FetchSimpleFeaturesByTagsTypes],
    createTagViewData
  );
};

export default fetchSimpleFeaturesByTags;

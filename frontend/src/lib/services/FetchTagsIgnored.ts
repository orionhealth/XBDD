import { doRequest, Method } from 'lib/rest/RestRequests';
import TagsIgnored from 'models/TagsIgnored';
import FetchTagsIgnoredTypes from './generated/FetchTagsIgnoredTypes';

type ResponseData = string[];

const createIgnoredTags = (responseData: ResponseData): TagsIgnored => {
  const tagsIgnored: TagsIgnored = {};
  responseData.forEach(item => (tagsIgnored[item] = true));
  return tagsIgnored;
};

const fetchTagsIgnored = (product: string): Promise<TagsIgnored | void> => {
  const url = `/user/ignoredTags/${product}`;
  return doRequest(Method.GET, url, 'rest.error.get', null, FetchTagsIgnoredTypes, (responseData: ResponseData) => {
    return createIgnoredTags(responseData);
  });
};

export default fetchTagsIgnored;

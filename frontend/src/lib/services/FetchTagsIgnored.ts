import { getValidToken } from './TokenService';
import { doRequest, Method } from 'lib/rest/RestRequests';
import TagsIgnored from 'models/TagsIgnored';
import FetchTagsIgnoredTypes from './generated/FetchTagsIgnoredTypes';

type ResponseData = string[];

const createIgnoredTags = (responseData: ResponseData): TagsIgnored => {
  const tagsIgnored: TagsIgnored = {};
  responseData.forEach(item => (tagsIgnored[item] = true));
  return tagsIgnored;
};

const fetchTagsIgnored = async (product: string): Promise<TagsIgnored | void> => {
  const url = `/rest/user/ignoredTags/${product}`;
  const token = await getValidToken();
  if (token) {
    return doRequest(Method.GET, url, 'rest.error.get', null, token, FetchTagsIgnoredTypes, createIgnoredTags);
  }
};

export default fetchTagsIgnored;

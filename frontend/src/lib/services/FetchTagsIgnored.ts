import { doRequest, Method } from 'lib/rest/RestRequests';
import { getEncodedURI } from 'lib/rest/URIHelper';
import TagsIgnored from 'models/TagsIgnored';
import FetchTagsIgnoredTypes from './generated/FetchTagsIgnoredTypes';

type ResponseData = string[];

const createIgnoredTags = (responseData: ResponseData): TagsIgnored => {
  const tagsIgnored: TagsIgnored = {};
  responseData.forEach(item => (tagsIgnored[item] = true));
  return tagsIgnored;
};

const fetchTagsIgnored = async (product: string): Promise<TagsIgnored | void> => {
  const url = `/rest/user/ignoredTags/${getEncodedURI(product)}`;
  return doRequest(Method.GET, url, 'rest.error.get', null, FetchTagsIgnoredTypes, createIgnoredTags);
};

export default fetchTagsIgnored;

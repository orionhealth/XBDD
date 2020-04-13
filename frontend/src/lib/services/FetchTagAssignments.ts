import { getValidToken } from './TokenService';
import { doRequest, Method } from 'lib/rest/RestRequests';
import TagAssignments from 'models/TagAssignments';
import FetchTagAssignmentsTypes from './generated/FetchTagAssignmentsTypes';

interface ResponseDataElement {
  tag: string;
  userId: string;
  userName?: string;
  avatarUrl?: string;
}
type ResponseData = ResponseDataElement[];

const createTagAssignments = (responseData: ResponseData): TagAssignments => {
  const tagAssignments: TagAssignments = {};
  responseData.forEach(item => (tagAssignments[item.tag] = { userId: item.userId, name: item.userName, avatarUrl: item.avatarUrl }));
  return tagAssignments;
};

const fetchTagAssignments = async (product: string, version: string, build: string): Promise<TagAssignments | void> => {
  const url = `/rest/user/tagAssignment/${product}/${version}/${build}`;
  const token = await getValidToken();
  if (token) {
    return doRequest(Method.GET, url, 'rest.error.get', null, token, FetchTagAssignmentsTypes, createTagAssignments);
  }
};

export default fetchTagAssignments;

import { doRequest, Method } from 'lib/rest/RestRequests';
import TagAssignments from 'models/TagAssignments';
import FetchTagAssignmentsTypes from './generated/FetchTagAssignmentsTypes';

interface ResponseDataElement {
  tag: string;
  userName?: string;
}
type ResponseData = ResponseDataElement[];

const createTagAssignments = (responseData: ResponseData): TagAssignments => {
  const tagAssignments: TagAssignments = {};
  responseData.forEach(item => (tagAssignments[item.tag] = item.userName));
  return tagAssignments;
};

const fetchTagAssignments = (product: string, version: string, build: string): Promise<TagAssignments | void> => {
  const url = `/user/tagAssignment/${product}/${version}/${build}`;
  return doRequest(Method.GET, url, 'rest.error.get', null, FetchTagAssignmentsTypes, (responseData: ResponseData) => {
    return createTagAssignments(responseData);
  });
};

export default fetchTagAssignments;

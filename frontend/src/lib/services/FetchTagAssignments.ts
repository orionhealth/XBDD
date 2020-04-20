import { User } from 'models/User';
import { doRequest, Method } from 'lib/rest/RestRequests';
import TagAssignments from 'models/TagAssignments';
import FetchTagAssignmentsTypes from './generated/FetchTagAssignmentsTypes';
import { getAvatarUrl } from './FetchLoggedInUser';

interface ResponseDataElement {
  tag: string;
  userId?: string;
  socialLogin?: string;
  loginType?: string;
  display?: string;
}
type ResponseData = ResponseDataElement[];

const mapUser = ({ userId, socialLogin, loginType, display }: ResponseDataElement): User | undefined => {
  if (userId && socialLogin && loginType && display) {
    return {
      userId,
      socialLogin,
      display,
      avatarUrl: getAvatarUrl(loginType, socialLogin),
    };
  }
};

const createTagAssignments = (responseData: ResponseData): TagAssignments => {
  const tagAssignments: TagAssignments = {};
  responseData.forEach(item => (tagAssignments[item.tag] = mapUser(item)));
  return tagAssignments;
};

const fetchTagAssignments = async (product: string, version: string, build: string): Promise<TagAssignments | void> => {
  const url = `/rest/user/tagAssignment/${product}/${version}/${build}`;
  return doRequest(Method.GET, url, 'rest.error.get', null, FetchTagAssignmentsTypes, createTagAssignments);
};

export default fetchTagAssignments;

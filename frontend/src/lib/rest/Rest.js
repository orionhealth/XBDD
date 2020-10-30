/* Remove these comments after this has been converted to TS */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { doRequest, Method } from './RestRequests';
import { getEncodedURI } from './URIHelper';

const { GET, PUT, DELETE } = Method;
const doGetRequest = async (path, errorMessage) => doRequest(GET, path, errorMessage, null);
const doPutRequest = async (path, errorMessage, data) => doRequest(PUT, path, errorMessage, data);
const doDeleteRequest = async (path, errorMessage) => doRequest(DELETE, path, errorMessage, null);

export const setProductFavouriteOn = product => doPutRequest(`/rest/favourites/${getEncodedURI(product)}`, 'rest.error.favourite');

export const setProductFavouriteOff = product => doDeleteRequest(`/rest/favourites/${getEncodedURI(product)}`, 'rest.error.unfavourite');

export const pinABuild = (product, version, build) =>
  doPutRequest(`/rest/favourites/pin/${getEncodedURI(product, version, build)}`, 'rest.error.pin');

export const unPinABuild = (product, version, build) =>
  doDeleteRequest(`/rest/favourites/pin/${getEncodedURI(product, version, build)}`, 'rest.error.unpin');

export const getRollUpData = (product, version, featureId) =>
  doGetRequest(`/rest/feature/rollup/${getEncodedURI(product, version, featureId)}`);

// path should be of type StepStatusPatch
export const updateStepPatch = (product, version, build, featureId, patch) =>
  doPutRequest(`/rest/feature/step/${getEncodedURI(product, version, build, featureId)}`, 'rest.error.updateStep', patch);

// path should be of type StepStatusPatch
export const updateAllStepPatch = (product, version, build, featureId, patch) =>
  doPutRequest(`/rest/feature/steps/${getEncodedURI(product, version, build, featureId)}`, 'rest.error.updateAllSteps', patch);

// patch should be of type InputFieldPatch
export const updateComment = (product, version, build, featureId, patch) =>
  doPutRequest(`/rest/feature/comments/${getEncodedURI(product, version, build, featureId)}`, 'rest.error.updateComment', patch);

// patch should be of type TagAssignment
export const assignTagToLoggedInUser = (product, version, build, tag) =>
  doPutRequest(`/rest/user/tagAssignment/${getEncodedURI(product, version, build)}`, 'rest.error.assignTag', { tag });

// patch should be of type TagAssignment
export const unAssignTag = (product, version, build, tag) =>
  doPutRequest(`/rest/user/tagAssignment/unAssign/${getEncodedURI(product, version, build)}`, 'rest.error.unassignTag', { tag });

export const setIgnoredTag = (product, patch) =>
  doPutRequest(`/rest/user/ignoredTags/${getEncodedURI(product)}`, 'rest.error.setIgnoredTag', patch);

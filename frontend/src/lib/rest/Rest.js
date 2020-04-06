import { doRequest, Method } from './RestRequests';

const { GET, PUT, DELETE } = Method;
const doGetRequest = (path, errorMessage) => doRequest(GET, path, errorMessage);
const doPutRequest = (path, data, errorMessage) => doRequest(PUT, path, errorMessage, data);
const doDeleteRequest = (path, errorMessage) => doRequest(DELETE, path, errorMessage);

export const setProductFavouriteOn = project => doPutRequest(`/rest/favourites/${project}/`, null, 'rest.error.favourite');

export const setProductFavouriteOff = project => doDeleteRequest(`/rest/favourites/${project}/`, 'rest.error.unfavourite');

export const pinABuild = (project, major, minor, servicePack, build) =>
  doPutRequest(`/rest/favourites/pin/${project}/${major}.${minor}.${servicePack}/${build}`, null, 'rest.error.pin');

export const unPinABuild = (project, major, minor, servicePack, build) =>
  doDeleteRequest(`/rest/favourites/pin/${project}/${major}.${minor}.${servicePack}/${build}`, 'rest.error.unpin');

export const getRollUpData = (product, version, feature) => doGetRequest(`/rest/feature/rollup/${product}/${version}/${feature}`);

// path should be of type StepStatusPatch
export const updateStepPatch = (featureId, patch) => doPutRequest(`/rest/feature/step/${featureId}`, patch);

// path should be of type StepStatusPatch
export const updateAllStepPatch = (featureId, patch) => doPutRequest(`/rest/feature/steps/${featureId}`, patch);

// patch should be of type InputFieldPatch
export const updateComments = (featureId, patch) => doPutRequest(`/rest/feature/comments/${featureId}`, patch);

// patch should be of type TagAssignment
export const setTagAssignmentData = (restId, patch) => doPutRequest(`/rest/user/tagAssignment/${restId}`, patch);

export const setIgnoredTag = (product, patch) => doPutRequest(`/rest/user/ignoredTags/${product}`, patch);

import InputFieldPatch from 'models/InputFieldPatch';
import StepStatusPatch from 'models/StepStatusPatch';
import { doRequest, Method } from './RestRequests';
import { getEncodedURI } from './URIHelper';

const { PUT, DELETE } = Method;
const doPutRequest = async (path: string, errorMessage: string, data: unknown): Promise<Response | void> =>
  doRequest(PUT, path, errorMessage, data);
const doDeleteRequest = async (path: string, errorMessage: string): Promise<Response | void> => doRequest(DELETE, path, errorMessage, null);

export const setProductFavouriteOn = (product: string): Promise<Response | void> =>
  doPutRequest(`/rest/favourites/${getEncodedURI(product)}`, 'rest.error.favourite', null);

export const setProductFavouriteOff = (product: string): Promise<Response | void> =>
  doDeleteRequest(`/rest/favourites/${getEncodedURI(product)}`, 'rest.error.unfavourite');

export const pinABuild = (product: string, version: string, build: string): Promise<Response | void> =>
  doPutRequest(`/rest/favourites/pin/${getEncodedURI(product, version, build)}`, 'rest.error.pin', null);

export const unPinABuild = (product: string, version: string, build: string): Promise<Response | void> =>
  doDeleteRequest(`/rest/favourites/pin/${getEncodedURI(product, version, build)}`, 'rest.error.unpin');

export const updateStepPatch = (
  product: string,
  version: string,
  build: string,
  featureId: string,
  patch: StepStatusPatch
): Promise<Response | void> =>
  doPutRequest(`/rest/feature/step/${getEncodedURI(product, version, build, featureId)}`, 'rest.error.updateStep', patch);

export const updateAllStepPatch = (
  product: string,
  version: string,
  build: string,
  featureId: string,
  patch: StepStatusPatch
): Promise<Response | void> =>
  doPutRequest(`/rest/feature/steps/${getEncodedURI(product, version, build, featureId)}`, 'rest.error.updateAllSteps', patch);

export const updateComment = (
  product: string,
  version: string,
  build: string,
  featureId: string,
  patch: InputFieldPatch
): Promise<Response | void> =>
  doPutRequest(`/rest/feature/comments/${getEncodedURI(product, version, build, featureId)}`, 'rest.error.updateComment', patch);

export const assignTagToLoggedInUser = (product: string, version: string, build: string, tag: string): Promise<Response | void> =>
  doPutRequest(`/rest/user/tagAssignment/${getEncodedURI(product, version, build)}`, 'rest.error.assignTag', { tag });

export const unAssignTag = (product: string, version: string, build: string, tag: string): Promise<Response | void> =>
  doPutRequest(`/rest/user/tagAssignment/unAssign/${getEncodedURI(product, version, build)}`, 'rest.error.unassignTag', { tag });

export const setIgnoredTag = (product: string, patch: { tagName: string }): Promise<Response | void> =>
  doPutRequest(`/rest/user/ignoredTags/${getEncodedURI(product)}`, 'rest.error.setIgnoredTag', patch);

import { showNotification } from 'modules/notifications/notifications';

const TIMEOUT_STATUS = 408;

const username = 'admin';
const password = 'password';
const backendUrl = process.env.REACT_APP_BACKEND_HOST;
const TIME_OUT = 10000;

const getHeaders = () => {
  const headers = new Headers();
  headers.set('Authorization', `Basic ${btoa(`${username}:${password}`)}`);
  headers.set('Content-Type', 'application/json');

  return headers;
};

const timeout = (promise, ms = TIME_OUT) => {
  let timerPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error(TIMEOUT_STATUS));
    }, ms);
  });
  return Promise.race([timerPromise, promise]);
};

const handleError = (error, url, message) => {
  console.error(`${url} failed with status ${error.message}`);
  showNotification({ message, severity: 'error' });
};

const doGetRequest = (path, errorMessage = 'rest.error.get') => {
  const url = `${backendUrl}${path}`;
  const options = {
    method: 'GET',
    headers: getHeaders(),
  };

  return timeout(fetch(url, options))
    .then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }

      if (response.status !== 204) {
        return response.json();
      }
    })
    .catch(error => handleError(error, url, errorMessage));
};

const doPutRequest = (path, data, errorMessage = 'rest.error.put') => {
  const url = `${backendUrl}${path}`;
  const options = {
    method: 'PUT',
    headers: getHeaders(),
    body: data ? JSON.stringify(data) : null,
  };

  return timeout(fetch(url, options))
    .then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response;
    })
    .catch(error => handleError(error, url, errorMessage));
};

const doDeleteRequest = (path, errorMessage = 'rest.error.delete') => {
  const url = `${backendUrl}${path}`;
  const options = {
    method: 'DELETE',
    headers: getHeaders(),
  };

  return timeout(fetch(url, options))
    .then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }

      return response;
    })
    .catch(error => handleError(error, url, errorMessage));
};

export const getSummaryOfReports = () => doGetRequest('/report', 'rest.error.summaryOfReports');

export const setProductFavouriteOn = project => doPutRequest(`/favourites/${project}/`, null, 'rest.error.favourite');

export const setProductFavouriteOff = project => doDeleteRequest(`/favourites/${project}/`, 'rest.error.unfavourite');

export const pinABuild = (project, major, minor, servicePack, build) =>
  doPutRequest(`/favourites/pin/${project}/${major}.${minor}.${servicePack}/${build}`, null, 'rest.error.pin');

export const unPinABuild = (project, major, minor, servicePack, build) =>
  doDeleteRequest(`/favourites/pin/${project}/${major}.${minor}.${servicePack}/${build}`, 'rest.error.unpin');

export const getFeatureListByTagData = (product, version, build) =>
  doGetRequest(`/tagview/featureTagIndex/${product}/${version}/${build}`, 'rest.error.featuresByTag');

export const getSimpleFeatureListData = (product, version, build) => doGetRequest(`/report/featureIndex/${product}/${version}/${build}`);

export const getFeatureReport = id => doGetRequest(`/feature/${id}`);

export const getRollUpData = (product, version, feature) => doGetRequest(`/feature/rollup/${product}/${version}/${feature}`);

// path should be of type StepStatusPatch
export const updateStepPatch = (featureId, patch) => doPutRequest(`/feature/step/${featureId}`, patch);

// path should be of type StepStatusPatch
export const updateAllStepPatch = (featureId, patch) => doPutRequest(`/feature/steps/${featureId}`, patch);

// patch should be of type InputFieldPatch
export const updateComments = (featureId, patch) => doPutRequest(`/feature/comments/${featureId}`, patch);

export const getTagAssignmentData = (product, version, build) => doGetRequest(`/user/tagAssignment/${product}/${version}/${build}`);

// patch should be of type TagAssignment
export const setTagAssignmentData = (restId, patch) => doPutRequest(`/user/tagAssignment/${restId}`, patch);

export const getIgnoredTags = product => doGetRequest(`/user/ignoredTags/${product}`);

export const setIgnoredTag = (product, patch) => doPutRequest(`/user/ignoredTags/${product}`, patch);

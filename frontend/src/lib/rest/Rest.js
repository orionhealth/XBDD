const username = "admin";
const password = "password";
const url = process.env.REACT_APP_BACKEND_HOST;
const TIME_OUT = 10000;

const getHeaders = () => {
  const headers = new Headers();
  headers.set("Authorization", `Basic ${btoa(`${username}:${password}`)}`);
  headers.set("Content-Type", "application/json");

  return headers;
};

const timeout = (promise, ms = TIME_OUT) => {
  let timerPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error("Request Timeout"));
    }, ms);
  });
  return Promise.race([timerPromise, promise]);
};

const doGetRequest = path => {
  const options = {
    method: "GET",
    headers: getHeaders(),
  };

  return timeout(fetch(`${url}${path}`, { ...options }))
    .then(response => (response.status === 200 ? response.json() : null))
    .catch(error => console.error(error));
};

const doPutRequest = (path, data) => {
  const options = {
    method: "PUT",
    headers: getHeaders(),
    body: data ? JSON.stringify(data) : null,
  };

  return timeout(fetch(`${url}${path}`, { ...options })).catch(error => console.error(error));
};

const doDeleteRequest = path => {
  const options = {
    method: "DELETE",
    headers: getHeaders(),
  };

  return timeout(fetch(`${url}${path}`, { ...options })).catch(error => console.error(error));
};

export const getSummaryOfReports = () => doGetRequest("/report");

export const getBuild = (project, version, build) => doGetRequest(`/report/${project}/${version}/${build}`);

export const setProductFavouriteOn = project => doPutRequest(`/favourites/${project}/`);

export const setProductFavouriteOff = project => doDeleteRequest(`/favourites/${project}/`);

export const pinABuild = (project, major, minor, servicePack, build) =>
  doPutRequest(`/favourites/pin/${project}/${major}.${minor}.${servicePack}/${build}`);

export const unPinABuild = (project, major, minor, servicePack, build) =>
  doDeleteRequest(`/favourites/pin/${project}/${major}.${minor}.${servicePack}/${build}`);

export const getFeatureListByTagData = (product, version, build) => doGetRequest(`/tagview/featureTagIndex/${product}/${version}/${build}`);

export const getSimpleFeatureListData = (product, version, build) => doGetRequest(`/report/featureIndex/${product}/${version}/${build}`);

export const getFeatureReport = id => doGetRequest(`/feature/${id}`);

export const getRollUpData = (product, version, feature) => doGetRequest(`/feature/rollup/${product}/${version}/${feature}`);

export const updateStepPatch = (featureId, patch) => doPutRequest(`/feature/step/${featureId}`, patch);

export const updateAllStepPatch = (featureId, patch) => doPutRequest(`/feature/steps/${featureId}`, patch);

export const updateComments = (featureId, patch) => doPutRequest(`/feature/comments/${featureId}`, patch);

export const getTagAssignmentData = (product, version, build) => doGetRequest(`/user/tagAssignment/${product}/${version}/${build}`);

export const setTagAssignmentData = (restId, patch) => doPutRequest(`/user/tagAssignment/${restId}`, patch);

export const getIgnoredTags = product => doGetRequest(`/user/ignoredTags/${product}`);

export const setIgnoredTag = (product, patch) => doPutRequest(`/user/ignoredTags/${product}`, patch);

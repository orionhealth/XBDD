const username = "admin";
const password = "password";
const url = process.env.REACT_APP_BACKEND_HOST;

const getHeaders = () => {
  const headers = new Headers();
  headers.set("Authorization", `Basic ${btoa(`${username}:${password}`)}`);
  headers.set("Content-Type", "application/json");

  return headers;
};

const doGetRequest = path => {
  const options = {
    method: "GET",
    headers: getHeaders(),
  };

  return fetch(`${url}${path}`, { ...options })
    .then(response => response.json())
    .catch(error => console.error(error));
};

const doPutRequest = path => {
  const options = {
    method: "PUT",
    headers: getHeaders(),
  };

  return fetch(`${url}${path}`, { ...options }).catch(error => console.error(error));
};

const doDeleteRequest = path => {
  const options = {
    method: "DELETE",
    headers: getHeaders(),
  };

  return fetch(`${url}${path}`, { ...options }).catch(error => console.error(error));
};

export const getSummaryOfReports = () => doGetRequest("/rest/reports");

export const getBuild = (project, version, build) => doGetRequest(`/rest/reports/${project}/${version}/${build}`);

export const setProductFavouriteOn = project => doPutRequest(`/rest/favourites/${project}/`);

export const setProductFavouriteOff = project => doDeleteRequest(`/rest/favourites/${project}/`);

export const pinABuild = (project, major, minor, servicePack, build) =>
  doPutRequest(`/rest/favourites/pin/${project}/${major}.${minor}.${servicePack}/${build}`);

export const unPinABuild = (project, major, minor, servicePack, build) =>
  doDeleteRequest(`/rest/favourites/pin/${project}/${major}.${minor}.${servicePack}/${build}`);

export const getBuildReport = (product, version, build) => doGetRequest(`/rest/reports/featureTagIndex/${product}/${version}/${build}`);

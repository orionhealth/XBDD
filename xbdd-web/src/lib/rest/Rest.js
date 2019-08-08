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

export const getSummaryOfReports = () => doGetRequest("/rest/reports");

export const getBuild = (project, version, build) => doGetRequest(`/rest/reports/${project}/${version}/${build}`);

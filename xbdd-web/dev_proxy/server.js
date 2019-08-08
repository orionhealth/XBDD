/* eslint-disable import/no-extraneous-dependencies */
"use strict"; //eslint-disable-line
import express from "express";
import { createProxyServer } from "http-proxy";
import _ from "lodash";
import url from "url";

import bodyParser from "body-parser";
import cors from "cors";
import http from "http";

const app = express();

const PROXY_PORT = 28081;

const hostName = "http://localhost:28080";

/*
    Proxying nightly/local fhir source from the express server using node-http-proxy library
    https://github.com/nodejitsu/node-http-proxy
*/
const appAPIProxy = createProxyServer();

app.use(cors({ origin: true, credentials: true }));
app.use(bodyParser.json()); // for parsing application/json

app.all("/*", (req, res) => {
  const target = url.resolve(hostName, req.url);

  setTimeout(() => {
    appAPIProxy.proxyRequest(req, res, {
      target,
      ignorePath: true,
      header: req.headers,
    });
  }, _.random(1000));
});

/* eslint-disable */

appAPIProxy.on("proxyReq", (proxyReq, req, res) => {
  if (req.body) {
    const bodyData = JSON.stringify(req.body);
    // incase if content-type is application/x-www-form-urlencoded -> we need to change to application/json
    proxyReq.setHeader("Content-Type", "application/json");
    // stream the content
    proxyReq.write(bodyData);
  }
});

appAPIProxy.on("proxyRes", (proxyRes, req, res) => {
  console.log("Response received");
});

appAPIProxy.on("error", (err, req, res) => {
  console.log("Error received");
});

http.createServer(app).listen(PROXY_PORT, () => {
  console.log(`Dev proxy listening on ${PROXY_PORT}`);
});

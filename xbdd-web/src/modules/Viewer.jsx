import React from "react";
import TagListContainer from "./viewer/tag-list/TagListContainer";
import FeatureSummaryViewContainer from "./viewer/feature/FeatureSummaryViewContainer";
import { Grid } from "@material-ui/core";

import Report from "../models/Report";
import tagListData from "../resources/tag-response.json";

import FeatureHistory from "../models/FeatureHistory";
import featureData from '../resources/dummyFeatureRollupData.json'

// TODO remove all dummy data once hooked up to backend
const dummyReport = new Report(tagListData);
const dummyFeatureData = new FeatureHistory(featureData);

const Viewer = () => (
  <Grid container>
    <Grid item xs={3}>
      <TagListContainer report={dummyReport} />
    </Grid>
    <Grid item xs={9}>
      <FeatureSummaryViewContainer featureRollupData={dummyFeatureData} />
    </Grid>
  </Grid>
);

export default Viewer;

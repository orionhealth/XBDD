import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { featureListStyles } from "./styles/FeatureReportContainerStyles";
import { List, ListItem } from "@material-ui/core";

const FeatureSummary = props => {
  return (
    <List>
      <ListItem>abc</ListItem>
    </List>
  );
};

export default withStyles(featureListStyles)(FeatureSummary);

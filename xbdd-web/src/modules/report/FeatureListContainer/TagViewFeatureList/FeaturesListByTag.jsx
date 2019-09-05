import React from "react";
import { PropTypes } from "prop-types";
import { List, ListItem } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { featureListItemStyles } from "../styles/FeatureListContainerStyles";

const FeaturesListByTag = props => {
  const { featureList, classes } = props;
  const classesMap = {
    passed: classes.xbddFeatureListItemPassed,
    failed: classes.xbddFeatureListItemFailed,
    undefined: classes.xbddFeatureListItemUndefined,
    skipped: classes.xbddFeatureListItemSkipped,
  };

  return (
    <List className={classes.xbddFeatureListContainer}>
      {featureList.map(feature => {
        return (
          <ListItem button key={feature.id} className={classesMap[feature.calculatedStatus]}>
            {feature.name}
          </ListItem>
        );
      })}
    </List>
  );
};

FeaturesListByTag.propTypes = {
  featureList: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  classes: PropTypes.shape({}).isRequired,
};

export default withStyles(featureListItemStyles)(FeaturesListByTag);

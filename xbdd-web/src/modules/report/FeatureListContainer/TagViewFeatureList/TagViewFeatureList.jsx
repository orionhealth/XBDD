import React from "react";
import { PropTypes } from "prop-types";
import { List, ListItem } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { featureListItemStyles } from "../styles/FeatureListContainerStyles";

const TagViewFeatureList = props => {
  const { featureList, handleFeatureSelected, classes } = props;
  const classesMap = {
    passed: classes.xbddFeatureListItemPassed,
    failed: classes.xbddFeatureListItemFailed,
    undefined: classes.xbddFeatureListItemUndefined,
    skipped: classes.xbddFeatureListItemSkipped,
  };

  return (
    <List>
      {featureList.map(feature => {
        return (
          <ListItem
            button
            key={feature.id}
            className={`${classesMap[feature.calculatedStatus]} ${classes.xbddTagViewFeatureList}`}
            onClick={() => handleFeatureSelected(feature.id)}
          >
            {feature.name}
          </ListItem>
        );
      })}
    </List>
  );
};

TagViewFeatureList.propTypes = {
  featureList: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  handleFeatureSelected: PropTypes.func.isRequired,
  classes: PropTypes.shape({}).isRequired,
};

export default withStyles(featureListItemStyles)(TagViewFeatureList);

import React from "react";
import { PropTypes } from "prop-types";
import { List, ListItem } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { tagListItemStyles } from "../styles/TagListStyles";

const TagListFeaturesListView = props => {
  const { featureList, classes } = props;
  const classesMap = {
    passed: classes.xbddFeatureListItemPassed,
    failed: classes.xbddFeatureListItemFailed,
    undefined: classes.xbddFeatureListItemUndefined,
    skipped: classes.xbddFeatureListItemSkipped,
  };

  return (
    <List className={classes.xbddFeatureListContainer}>
      {featureList.map(item => {
        return (
          <ListItem button key={item.id} className={classesMap[item.calculatedStatus]}>
            {item.name}
          </ListItem>
        );
      })}
    </List>
  );
};

TagListFeaturesListView.propTypes = {
  featureList: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  classes: PropTypes.shape({}).isRequired,
};

export default withStyles(tagListItemStyles)(TagListFeaturesListView);

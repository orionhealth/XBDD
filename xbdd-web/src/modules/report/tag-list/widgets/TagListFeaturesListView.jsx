import React from "react";
import { List, ListItem } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { tagListItemStyles } from "../styles/TagListStyles";

const TagListFeaturesListView = props => {
  const { features, classes } = props;

  const classesMap = {
    passed: classes.xbddFeatureListItemPassed,
    failed: classes.xbddFeatureListItemFailed,
    undefined: classes.xbddFeatureListItemUndefined,
    skipped: classes.xbddFeatureListItemSkipped,
  };

  return (
    <List className={classes.xbddFeatureListContainer}>
      {features.map(item => {
        return (
          <ListItem button key={item.id} className={classesMap[item.calculatedStatus]}>
            {item.name}
          </ListItem>
        );
      })}
    </List>
  );
};

export default withStyles(tagListItemStyles)(TagListFeaturesListView);

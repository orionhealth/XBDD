import React from "react";
import { List, ListItem, Card } from "@material-ui/core";
import { featureListItemStyles } from "../styles/FeatureListContainerStyles";
import { withStyles } from "@material-ui/styles";

const ListViewFeatureList = props => {
  const { featureList, selectedStatus, classes } = props;
  const filterFeatureList = featureList.filter(feature => selectedStatus[feature.calculatedStatus]);

  const classesMap = {
    passed: classes.xbddFeatureListItemPassed,
    failed: classes.xbddFeatureListItemFailed,
    undefined: classes.xbddFeatureListItemUndefined,
    skipped: classes.xbddFeatureListItemSkipped,
  };

  return (
    <Card>
      <List>
        {filterFeatureList.map(feature => (
          <ListItem button divider key={feature.id} className={classes.xbddFeatureListItem + " " + classesMap[feature.calculatedStatus]}>
            {feature.name}
            <span style={{ background: "blue" }}>{feature.tags ? feature.tags.map(tag => tag.name) : null}</span>
          </ListItem>
        ))}
      </List>
    </Card>
  );
};

export default withStyles(featureListItemStyles)(ListViewFeatureList);

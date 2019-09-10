import React from "react";
import { PropTypes } from "prop-types";
import { List, ListItem, Card } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import { featureListItemStyles } from "../styles/FeatureListContainerStyles";

const renderTags = (tags, classes) => <span className={classes}>{tags.map(tag => tag.name)}</span>;

const ListViewFeatureList = props => {
  const { featureList, selectedStatus, handleFeatureSelected, classes } = props;
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
          <ListItem button key={feature.id} className={classes.xbddFeatureListItem} onClick={() => handleFeatureSelected(feature.id)}>
            <span className={classesMap[feature.calculatedStatus]}>{" " + feature.name + " "}</span>
            {feature.tags ? renderTags(feature.tags, classes.tags) : null}
          </ListItem>
        ))}
      </List>
    </Card>
  );
};

ListViewFeatureList.propTypes = {
  featureList: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  selectedStatus: PropTypes.shape({}).isRequired,
  handleFeatureSelected: PropTypes.func.isRequired,
  classes: PropTypes.shape({}),
};

export default withStyles(featureListItemStyles)(ListViewFeatureList);

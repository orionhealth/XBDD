import React from "react";
import { PropTypes } from "prop-types";
import { List, ListItem, Card, Chip } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import { featureListItemStyles } from "../styles/FeatureListContainerStyles";

const renderTags = (tags, classes) => tags.map(tag => <Chip key={tag.name} label={tag.name} size="small" className={classes} />);

const renderFeatureListItem = (feature, selectedFeatureId, statusClasses, handleFeatureSelected, classes) => {
  var className = `${statusClasses} ${classes.xbddFeatureListItem}`;

  if (feature._id === selectedFeatureId) {
    className += ` ${classes.xbddFeatureListItemSelected}`;
  }

  return (
    <ListItem button key={feature._id} className={className} onClick={() => handleFeatureSelected(feature)}>
      <span className={statusClasses}>{feature.name + " "}</span>
      {feature.tags ? renderTags(feature.tags, classes.tags) : null}
    </ListItem>
  );
};

const ListViewFeatureList = props => {
  const { featureList, selectedFeatureId, selectedStatus, handleFeatureSelected, classes } = props;
  const filterFeatureList = featureList.filter(feature => selectedStatus[feature.calculatedStatus]);

  const classesMap = {
    passed: classes.xbddFeatureListItemPassed,
    failed: classes.xbddFeatureListItemFailed,
    undefined: classes.xbddFeatureListItemUndefined,
    skipped: classes.xbddFeatureListItemSkipped,
  };

  return (
    <Card raised>
      <List>
        {filterFeatureList.map(feature =>
          renderFeatureListItem(feature, selectedFeatureId, classesMap[feature.calculatedStatus], handleFeatureSelected, classes))}
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

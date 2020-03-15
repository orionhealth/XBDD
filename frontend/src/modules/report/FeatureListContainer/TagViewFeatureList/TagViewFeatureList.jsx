import React from 'react';
import { PropTypes } from 'prop-types';
import { List, ListItem } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import { featureListItemStyles } from '../styles/FeatureListContainerStyles';

const renderFeatureListItem = (feature, selectedFeatureId, statusClasses, handleFeatureSelected, classes) => {
  var className = `${classes.listItem} ${statusClasses} ${classes.item}`;
  if (feature._id === selectedFeatureId) {
    className += ` ${classes.itemSelected}`;
  }

  return (
    <ListItem button key={feature._id} className={className} onClick={() => handleFeatureSelected(feature)}>
      {feature.name}
    </ListItem>
  );
};

const TagViewFeatureList = props => {
  const { selectedFeatureId, featureList, handleFeatureSelected, classes } = props;
  const classesMap = {
    passed: classes.itemPassed,
    failed: classes.itemFailed,
    undefined: classes.itemUndefined,
    skipped: classes.itemSkipped,
  };

  return (
    <List>
      {featureList.map(feature =>
        renderFeatureListItem(feature, selectedFeatureId, classesMap[feature.calculatedStatus], handleFeatureSelected, classes)
      )}
    </List>
  );
};

TagViewFeatureList.propTypes = {
  featureList: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  handleFeatureSelected: PropTypes.func.isRequired,
  classes: PropTypes.shape({}).isRequired,
};

export default withStyles(featureListItemStyles)(TagViewFeatureList);

import React from 'react';
import { PropTypes } from 'prop-types';
import { List, ListItem } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import { featureListItemStyles } from '../styles/FeatureListContainerStyles';

const renderFeatureListItem = (feature, selectedFeatureId, statusClasses, handleFeatureSelected, classes) => {
  var className = `${classes.xbddTagViewFeatureListItem} ${statusClasses} ${classes.xbddFeatureListItem}`;
  if (feature._id === selectedFeatureId) {
    className += ` ${classes.xbddFeatureListItemSelected}`;
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
    passed: classes.xbddFeatureListItemPassed,
    failed: classes.xbddFeatureListItemFailed,
    undefined: classes.xbddFeatureListItemUndefined,
    skipped: classes.xbddFeatureListItemSkipped,
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

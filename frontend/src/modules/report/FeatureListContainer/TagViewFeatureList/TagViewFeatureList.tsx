import React, { FC } from 'react';
import { List, ListItem } from '@material-ui/core';
import { withStyles, WithStyles } from '@material-ui/core/styles';

import { featureListItemStyles } from '../styles/FeatureListContainerStyles';
import Feature from 'models/Feature';
import { StatusMap, Passed, Failed, Skipped, Undefined } from 'models/Status';

interface Props extends WithStyles {
  featureList: Feature[];
  handleFeatureSelected(): void;
}

const TagViewFeatureList: FC<Props> = ({ selectedFeatureId, featureList, handleFeatureSelected, classes }) => {
  const classesMap: StatusMap<string> = {
    [Passed]: classes.itemPassed,
    [Failed]: classes.itemFailed,
    [Undefined]: classes.itemUndefined,
    [Skipped]: classes.itemSkipped,
  };

  const renderFeatureListItem = (feature, statusClasses): ReactNode => {
    let className = `${classes.listItem} ${statusClasses} ${classes.item}`;
    if (feature._id === selectedFeatureId) {
      className += ` ${classes.itemSelected}`;
    }

    return (
      <ListItem button key={feature._id} className={className} onClick={(): void => handleFeatureSelected(feature)}>
        {feature.name}
      </ListItem>
    );
  };

  return <List>{featureList.map(feature => renderFeatureListItem(feature, classesMap[feature.calculatedStatus]))}</List>;
};

export default withStyles(featureListItemStyles)(TagViewFeatureList);
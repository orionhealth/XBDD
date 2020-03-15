import React, { FC } from 'react';
import { List, ListItem, Card, Chip, WithStyles } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';

import { featureListItemStyles } from '../styles/FeatureListContainerStyles';
import Feature from 'models/Feature';
import { StatusMap, Passed, Skipped, Failed, Undefined } from 'models/Status';

interface Props extends WithStyles {
  featureList: Feature[];
  selectedFeatureId: string;
  selectedStatus: StatusMap<boolean>;
  handleFeatureSelected(feature: Feature): void;
}

const ListViewFeatureList: FC<Props> = ({ featureList, selectedFeatureId, selectedStatus, handleFeatureSelected, classes }) => {
  const filterFeatureList = featureList.filter(feature => selectedStatus[feature.calculatedStatus]);

  const classesMap: StatusMap<string> = {
    [Passed]: classes.itemPassed,
    [Failed]: classes.itemFailed,
    [Undefined]: classes.itemUndefined,
    [Skipped]: classes.itemSkipped,
  };

  const getItemClasses = (feature: Feature, statusClass: string): string =>
    feature._id === selectedFeatureId ? `${statusClass} ${classes.item} ${classes.itemSelected}` : `${statusClass} ${classes.item}`;

  return (
    <Card raised>
      <List>
        {filterFeatureList.map(feature => (
          <ListItem
            button
            key={feature._id}
            className={getItemClasses(feature, classesMap[feature.calculatedStatus])}
            onClick={(): void => handleFeatureSelected(feature)}
          >
            <span className={classesMap[feature.calculatedStatus]}>{feature.name + ' '}</span>
            {feature.tags?.map(tag => (
              <Chip key={tag.name} label={tag.name} size="small" className={classes.tags} />
            ))}
          </ListItem>
        ))}
      </List>
    </Card>
  );
};

export default withStyles(featureListItemStyles)(ListViewFeatureList);

import React, { FC } from 'react';
import { List, ListItem, Card, Chip, WithStyles } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { useDispatch } from 'react-redux';

import { featureListItemStyles } from '../styles/FeatureListContainerStyles';
import { StatusMap, Passed, Skipped, Failed, Undefined } from 'models/Status';
import SimpleFeature from 'models/SimpleFeature';
import { selectFeature } from 'redux/FeatureReducer';

interface Props extends WithStyles {
  productId: string;
  versionString: string;
  featureList: SimpleFeature[];
  selectedFeatureId?: string;
  selectedStatus: StatusMap<boolean>;
}

const ListViewFeatureList: FC<Props> = ({ productId, versionString, featureList, selectedFeatureId, selectedStatus, classes }) => {
  const dispatch = useDispatch();
  const filterFeatureList = featureList.filter(feature => selectedStatus[feature.calculatedStatus]);

  const classesMap: StatusMap<string> = {
    [Passed]: classes.itemPassed,
    [Failed]: classes.itemFailed,
    [Undefined]: classes.itemUndefined,
    [Skipped]: classes.itemSkipped,
  };

  const getItemClasses = (feature: SimpleFeature, statusClass: string): string =>
    feature._id === selectedFeatureId ? `${statusClass} ${classes.item} ${classes.itemSelected}` : `${statusClass} ${classes.item}`;

  return (
    <Card raised>
      <List>
        {filterFeatureList.map(feature => (
          <ListItem
            button
            key={feature._id}
            className={getItemClasses(feature, classesMap[feature.calculatedStatus])}
            onClick={(): void => {
              dispatch(selectFeature(productId, versionString, feature));
            }}
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

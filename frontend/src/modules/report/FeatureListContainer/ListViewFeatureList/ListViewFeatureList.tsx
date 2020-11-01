import React, { FC } from 'react';
import { List, ListItem, Card, Chip } from '@material-ui/core';
import { useDispatch } from 'react-redux';

import { useFeatureListItemStyles } from '../styles/FeatureListContainerStyles';
import { StatusMap } from 'models/Status';
import { SimpleFeature } from 'models/Feature';
import { selectFeature } from 'redux/FeatureReducer';
import { useStatusColorStyles } from 'modules/styles/globalStyles';

interface Props {
  featureList: SimpleFeature[];
  selectedFeatureId?: string;
  selectedStatus: StatusMap<boolean>;
}

const ListViewFeatureList: FC<Props> = ({ featureList, selectedFeatureId, selectedStatus }) => {
  const dispatch = useDispatch();
  const classes = useFeatureListItemStyles();

  const filterFeatureList = featureList.filter(feature => selectedStatus[feature.calculatedStatus]);

  const classesMap = useStatusColorStyles();

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
              dispatch(selectFeature(feature.id));
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

export default ListViewFeatureList;

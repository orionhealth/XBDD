import React, { FC } from 'react';
import { Chip, ListItem } from '@material-ui/core';
import { useDispatch } from 'react-redux';

import { useFeatureListItemStyles } from './styles/FeatureListStyles';
import { SimpleFeature } from 'models/Feature';
import { selectFeature } from 'redux/FeatureReducer';
import { useStatusColorStyles } from 'modules/styles/globalStyles';

interface Props {
  selectedFeatureId?: string;
  feature: SimpleFeature;
  showTags: boolean;
}

const FeatureListItem: FC<Props> = ({ selectedFeatureId, feature, showTags }) => {
  const dispatch = useDispatch();
  const classes = useFeatureListItemStyles();
  const classesMap = useStatusColorStyles();

  let className = `${classesMap[feature.calculatedStatus]} ${classes.item}`;
  if (feature._id === selectedFeatureId) {
    className += ` ${classes.itemSelected}`;
  }

  return (
    <ListItem
      button
      key={feature._id}
      className={className}
      onClick={(): void => {
        dispatch(selectFeature(feature.id));
      }}
    >
      <span className={classes.featureName}>{feature.name}</span>
      {showTags && feature.tags?.map(tag => <Chip key={tag.name} label={tag.name} size="small" className={classes.tags} />)}
    </ListItem>
  );
};

export default FeatureListItem;

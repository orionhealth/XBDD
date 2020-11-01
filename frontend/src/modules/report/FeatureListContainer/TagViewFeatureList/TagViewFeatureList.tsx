import React, { FC, ReactNode } from 'react';
import { List, ListItem } from '@material-ui/core';
import { useDispatch } from 'react-redux';

import { useFeatureListItemStyles } from '../styles/FeatureListContainerStyles';
import { SimpleFeature } from 'models/Feature';
import { selectFeature } from 'redux/FeatureReducer';
import { useStatusColorStyles } from 'modules/styles/globalStyles';

interface Props {
  selectedFeatureId?: string;
  featureList: SimpleFeature[];
}

const TagViewFeatureList: FC<Props> = ({ selectedFeatureId, featureList }) => {
  const dispatch = useDispatch();
  const classes = useFeatureListItemStyles();

  const classesMap = useStatusColorStyles();

  const renderFeatureListItem = (feature: SimpleFeature, statusClasses: string): ReactNode => {
    let className = `${classes.listItem} ${statusClasses} ${classes.item}`;
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
        {feature.name}
      </ListItem>
    );
  };

  return <List>{featureList.map(feature => renderFeatureListItem(feature, classesMap[feature.calculatedStatus]))}</List>;
};

export default TagViewFeatureList;

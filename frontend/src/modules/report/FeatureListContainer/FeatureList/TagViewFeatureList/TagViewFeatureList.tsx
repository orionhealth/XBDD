import React, { FC } from 'react';
import { List } from '@material-ui/core';

import { useFeatureListItemStyles } from '../styles/FeatureListStyles';
import { SimpleFeature } from 'models/Feature';
import FeatureListItem from '../FeatureListItem';

interface Props {
  selectedFeatureId?: string;
  featureList: SimpleFeature[];
}

const TagViewFeatureList: FC<Props> = ({ selectedFeatureId, featureList }) => {
  const classes = useFeatureListItemStyles();

  return (
    <List className={classes.tagViewFeatureList}>
      {featureList.map(feature => (
        <FeatureListItem key={feature.id} selectedFeatureId={selectedFeatureId} feature={feature} showTags={false} />
      ))}
    </List>
  );
};

export default TagViewFeatureList;

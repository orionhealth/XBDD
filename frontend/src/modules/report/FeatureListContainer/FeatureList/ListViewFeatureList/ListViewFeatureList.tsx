import React, { FC } from 'react';
import { List, Card } from '@material-ui/core';

import { SimpleFeature } from 'models/Feature';
import FeatureListItem from '../FeatureListItem';

interface Props {
  featureList: SimpleFeature[];
  selectedFeatureId?: string;
}

const ListViewFeatureList: FC<Props> = ({ featureList, selectedFeatureId }) => {
  return (
    <Card raised>
      <List>
        {featureList.map(feature => (
          <FeatureListItem key={feature.id} selectedFeatureId={selectedFeatureId} feature={feature} showTags={true} />
        ))}
      </List>
    </Card>
  );
};

export default ListViewFeatureList;

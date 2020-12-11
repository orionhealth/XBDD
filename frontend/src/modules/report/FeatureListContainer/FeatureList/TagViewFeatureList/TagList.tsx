import React, { FC } from 'react';
import { Card, List } from '@material-ui/core';

import TagListItem from './TagListItem';
import Tag from 'models/Tag';

interface Props {
  isEditMode: boolean;
  isAssignedTagsView: boolean;
  tagList: Tag[];
  selectedFeatureId?: string;
}

const TagList: FC<Props> = ({ isEditMode, isAssignedTagsView, tagList, selectedFeatureId }) => {
  return (
    <Card raised>
      <List>
        {tagList.map(tag => (
          <TagListItem
            isEditMode={isEditMode}
            isAssignedTagsView={isAssignedTagsView}
            tag={tag}
            key={tag.name}
            selectedFeatureId={selectedFeatureId}
          />
        ))}
      </List>
    </Card>
  );
};

export default TagList;

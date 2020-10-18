import React, { FC } from 'react';
import { Card, List } from '@material-ui/core';
import { withStyles, WithStyles } from '@material-ui/core/styles';

import { tagListStyles } from './styles/TagListStyles';
import TagListItem from './TagListItem';
import Tag from 'models/Tag';
import { StatusMap } from 'models/Status';
import TagAssignments from 'models/TagAssignments';

interface Props extends WithStyles {
  isEditMode: boolean;
  isAssignedTagsView: boolean;
  tagList: Tag[];
  tagAssignments: TagAssignments;
  selectedFeatureId?: string;
  selectedStatus: StatusMap<boolean>;
}

const TagList: FC<Props> = ({ isEditMode, isAssignedTagsView, tagList, tagAssignments, selectedFeatureId, selectedStatus, classes }) => {
  return (
    <Card raised className={classes.tagList}>
      <List component="ul">
        {tagList.map(tag => (
          <TagListItem
            isEditMode={isEditMode}
            isAssignedTagsView={isAssignedTagsView}
            tag={tag}
            tagAssignments={tagAssignments}
            key={tag.name}
            selectedFeatureId={selectedFeatureId}
            selectedStatus={selectedStatus}
          />
        ))}
      </List>
    </Card>
  );
};

export default withStyles(tagListStyles)(TagList);

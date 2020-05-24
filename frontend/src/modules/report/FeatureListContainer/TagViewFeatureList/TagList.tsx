import React, { FC } from 'react';
import { Card, List } from '@material-ui/core';
import { withStyles, WithStyles } from '@material-ui/core/styles';

import { tagListStyles } from './styles/TagListStyles';
import TagListItem from './TagListItem';
import Tag from 'models/Tag';
import { StatusMap } from 'models/Status';
import TagAssignments from 'models/TagAssignments';

interface Props extends WithStyles {
  productId: string;
  versionString: string;
  isEditMode: boolean;
  isAssignedTagsView: boolean;
  tagList: Tag[];
  tagAssignments: TagAssignments;
  restId: string;
  selectedFeatureId?: string;
  selectedStatus: StatusMap<boolean>;
}

const TagList: FC<Props> = ({
  productId,
  versionString,
  isEditMode,
  isAssignedTagsView,
  tagList,
  tagAssignments,
  restId,
  selectedFeatureId,
  selectedStatus,
  classes,
}) => {
  return (
    <Card raised className={classes.tagList}>
      <List component="ul">
        {tagList.map(tag => (
          <TagListItem
            productId={productId}
            versionString={versionString}
            isEditMode={isEditMode}
            isAssignedTagsView={isAssignedTagsView}
            tag={tag}
            tagAssignments={tagAssignments}
            key={tag.name}
            restId={restId}
            selectedFeatureId={selectedFeatureId}
            selectedStatus={selectedStatus}
          />
        ))}
      </List>
    </Card>
  );
};

export default withStyles(tagListStyles)(TagList);

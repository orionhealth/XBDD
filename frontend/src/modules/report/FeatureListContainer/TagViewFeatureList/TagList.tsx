import React, { FC } from 'react';
import { Card, List } from '@material-ui/core';
import { withStyles, WithStyles } from '@material-ui/core/styles';

import { tagListStyles } from './styles/TagListStyles';
import TagListItem from './TagListItem';
import Tag from 'models/Tag';
import Status from 'models/Status';

interface Props extends WithStyles {
  loggedInUserName: string;
  isEditMode: boolean;
  isAssignedTagsView: boolean;
  tagList: Tag[];
  restId: string;
  selectedFeatureId: string;
  selectedStatus: Status;
  handleFeatureSelected(): void;
  handleTagAssigned(): void;
  handleWarningShow(): void;
  handleTagIgnore(): void;
}

const TagList: FC<Props> = ({
  loggedInUserName,
  isEditMode,
  isAssignedTagsView,
  tagList,
  restId,
  selectedFeatureId,
  selectedStatus,
  handleFeatureSelected,
  handleTagAssigned,
  handleWarningShow,
  handleTagIgnore,
  classes,
}) => {
  return (
    <Card raised className={classes.tagList}>
      <List component="ul">
        {tagList.map(tag => (
          <TagListItem
            loggedInUserName={loggedInUserName}
            isEditMode={isEditMode}
            isAssignedTagsView={isAssignedTagsView}
            tag={tag}
            key={tag.name}
            restId={restId}
            selectedFeatureId={selectedFeatureId}
            selectedStatus={selectedStatus}
            handleFeatureSelected={handleFeatureSelected}
            handleTagAssigned={handleTagAssigned}
            handleWarningShow={handleWarningShow}
            handleTagIgnore={handleTagIgnore}
          />
        ))}
      </List>
    </Card>
  );
};

export default withStyles(tagListStyles)(TagList);
